import type { Database } from "@db/sqlite";
import type { TodoRepository, TodoFilter, TagInfo } from "../../domain/repository.ts";
import type { Todo } from "../../domain/types/Todo.ts";
import type { TodoId } from "../../domain/types/TodoId.ts";
import type { Result } from "../../shared/Result.ts";
import { success, fail } from "../../shared/Result.ts";
import { toDomain, toPersistence } from "./mappers/todoMapper.ts";
import { normalizeTagName } from "../../domain/types/Tag.ts";
import { isOverdue } from "../../domain/types/Todo.ts";

/**
 * Creates a SQLite-based todo repository.
 * Factory function that receives database connection and returns repository implementation.
 * 
 * @param db - SQLite database connection
 * @returns TodoRepository implementation
 */
export function createTodoRepository(db: Database): TodoRepository {
  /**
   * Gets or creates a tag, returns tag ID.
   * Stores lowercase name but preserves first-used display name.
   */
  function getOrCreateTag(tagName: string, displayName: string): number {
    const normalized = normalizeTagName(tagName);
    
    const stmt = db.prepare("SELECT id FROM tags WHERE name = ?");
    const rows = stmt.values(normalized) as unknown[][];
    
    if (rows.length > 0) {
      return rows[0][0] as number;
    }
    
    const insertStmt = db.prepare("INSERT INTO tags (name, display_name) VALUES (?, ?)");
    insertStmt.run(normalized, displayName.trim());
    return db.lastInsertRowId;
  }

  /**
   * Saves todo tags (many-to-many relationship).
   */
  function saveTodoTags(todoId: number, tags: ReadonlyArray<string>): void {
    // Delete existing tag associations
    const deleteStmt = db.prepare("DELETE FROM todo_tags WHERE todo_id = ?");
    deleteStmt.run(todoId);
    
    // Insert new tag associations
    const insertStmt = db.prepare("INSERT INTO todo_tags (todo_id, tag_id) VALUES (?, ?)");
    for (const tagName of tags) {
      const tagId = getOrCreateTag(tagName, tagName);
      insertStmt.run(todoId, tagId);
    }
  }

  /**
   * Loads tags for a todo with display names.
   */
  function loadTodoTags(todoId: number): string[] {
    const stmt = db.prepare(
      `SELECT t.display_name 
       FROM tags t
       JOIN todo_tags tt ON t.id = tt.tag_id
       WHERE tt.todo_id = ?
       ORDER BY t.display_name`
    );
    
    const rows = stmt.values(todoId) as unknown[][];
    return rows.map((row) => row[0] as string);
  }

  /**
   * Saves a todo to the database.
   */
  async function save(todo: Todo): Promise<Result<Todo>> {
    try {
      const row = toPersistence(todo);
      
      // Check if todo exists (only check if id is not 0)
      let actualId = row.id;
      
      if (row.id === 0) {
        // Insert new todo
        const insertStmt = db.prepare(
          `INSERT INTO todos 
            (title, description, priority, status, category, due_date, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`
        );
        insertStmt.run(
          row.title,
          row.description,
          row.priority,
          row.status,
          row.category,
          row.due_date,
          row.created_at
        );
        actualId = db.lastInsertRowId;
      } else {
        // Update existing todo
        const updateStmt = db.prepare(
          `UPDATE todos SET 
            title = ?, description = ?, priority = ?, status = ?,
            category = ?, due_date = ?, completed_at = ?
          WHERE id = ?`
        );
        updateStmt.run(
          row.title,
          row.description,
          row.priority,
          row.status,
          row.category,
          row.due_date,
          row.completed_at,
          row.id
        );
      }

      // Save tags (many-to-many)
      saveTodoTags(actualId, todo.tags);

      // Load the saved todo with tags
      const loadedResult = await findById(actualId as TodoId);
      if (!loadedResult.success) {
        return fail(`Failed to load saved todo: ${loadedResult.error}`);
      }

      return success(loadedResult.value);
    } catch (error) {
      return fail(`Failed to save todo: ${(error as Error).message}`);
    }
  }

  /**
   * Finds a todo by ID.
   */
  async function findById(id: TodoId): Promise<Result<Todo>> {
    try {
      const stmt = db.prepare("SELECT * FROM todos WHERE id = ?");
      const rows = stmt.values(id as number);
      
      if (rows.length === 0) {
        return fail(`Todo with ID ${id} not found`);
      }

      const rowArray = rows[0] as unknown[];
      const todoId = rowArray[0] as number;
      const tags = loadTodoTags(todoId);
      return toDomain(rowArray, tags);
    } catch (error) {
      return fail(`Failed to find todo: ${(error as Error).message}`);
    }
  }

  /**
   * Finds all todos, optionally filtered.
   */
  async function findAll(filter?: TodoFilter): Promise<Result<Todo[]>> {
    try {
      let sql = "SELECT * FROM todos WHERE 1=1";
      const params: unknown[] = [];

      if (filter?.status) {
        sql += " AND status = ?";
        params.push(filter.status);
      }

      if (filter?.priority) {
        sql += " AND priority = ?";
        params.push(filter.priority);
      }

      if (filter?.category) {
        sql += " AND category = ?";
        params.push(filter.category);
      }

      if (filter?.tag) {
        sql += ` AND id IN (
          SELECT tt.todo_id 
          FROM todo_tags tt
          JOIN tags t ON tt.tag_id = t.id
          WHERE t.name = ?
        )`;
        params.push(normalizeTagName(filter.tag));
      }

      sql += " ORDER BY created_at DESC";

      const stmt = db.prepare(sql);
      const rows = stmt.values(...params) as unknown[][];

      const todos: Todo[] = [];
      for (const row of rows) {
        const rowArray = row as unknown[];
        const todoId = rowArray[0] as number;
        const tags = loadTodoTags(todoId);
        const todoResult = toDomain(rowArray, tags);
        
        if (!todoResult.success) {
          return fail(`Failed to map todo: ${todoResult.error}`);
        }

        // Apply overdue filter if specified
        if (filter?.overdue === true && !isOverdue(todoResult.value)) {
          continue;
        }

        todos.push(todoResult.value);
      }

      return success(todos);
    } catch (error) {
      return fail(`Failed to find todos: ${(error as Error).message}`);
    }
  }

  /**
   * Deletes a todo by ID.
   */
  async function deleteTodo(id: TodoId): Promise<Result<void>> {
    try {
      const stmt = db.prepare("DELETE FROM todos WHERE id = ?");
      stmt.run(id as number);
      
      if (db.changes === 0) {
        return fail(`Todo with ID ${id} not found`);
      }

      return success(undefined);
    } catch (error) {
      return fail(`Failed to delete todo: ${(error as Error).message}`);
    }
  }

  /**
   * Searches todos by text query.
   */
  async function search(query: string, filter?: TodoFilter): Promise<Result<Todo[]>> {
    try {
      const searchPattern = `%${query}%`;
      let sql = `SELECT * FROM todos 
                 WHERE (title LIKE ? OR description LIKE ?)`;
      const params: unknown[] = [searchPattern, searchPattern];

      if (filter?.status) {
        sql += " AND status = ?";
        params.push(filter.status);
      }

      if (filter?.priority) {
        sql += " AND priority = ?";
        params.push(filter.priority);
      }

      if (filter?.category) {
        sql += " AND category = ?";
        params.push(filter.category);
      }

      if (filter?.tag) {
        sql += ` AND id IN (
          SELECT tt.todo_id 
          FROM todo_tags tt
          JOIN tags t ON tt.tag_id = t.id
          WHERE t.name = ?
        )`;
        params.push(normalizeTagName(filter.tag));
      }

      sql += " ORDER BY created_at DESC";

      const stmt = db.prepare(sql);
      const rows = stmt.values(...params) as unknown[][];

      const todos: Todo[] = [];
      for (const row of rows) {
        const rowArray = row as unknown[];
        const todoId = rowArray[0] as number;
        const tags = loadTodoTags(todoId);
        const todoResult = toDomain(rowArray, tags);
        
        if (!todoResult.success) {
          return fail(`Failed to map todo: ${todoResult.error}`);
        }

        // Apply overdue filter if specified
        if (filter?.overdue === true && !isOverdue(todoResult.value)) {
          continue;
        }

        todos.push(todoResult.value);
      }

      return success(todos);
    } catch (error) {
      return fail(`Failed to search todos: ${(error as Error).message}`);
    }
  }

  /**
   * Finds todos by tag.
   */
  async function findByTag(tagName: string): Promise<Result<Todo[]>> {
    return findAll({ tag: tagName });
  }

  /**
   * Gets all tags (display names).
   */
  async function getAllTags(): Promise<Result<string[]>> {
    try {
      const stmt = db.prepare("SELECT display_name FROM tags ORDER BY display_name");
      const rows = stmt.values() as unknown[][];
      const tags = rows.map((row) => row[0] as string);
      return success(tags);
    } catch (error) {
      return fail(`Failed to get tags: ${(error as Error).message}`);
    }
  }

  /**
   * Gets all tags with usage counts.
   */
  async function getAllTagsWithCounts(): Promise<Result<TagInfo[]>> {
    try {
      const stmt = db.prepare(
        `SELECT t.name, t.display_name, COUNT(tt.todo_id) as count
         FROM tags t
         LEFT JOIN todo_tags tt ON t.id = tt.tag_id
         GROUP BY t.id
         ORDER BY count DESC, t.display_name ASC`
      );
      
      const rows = stmt.values() as unknown[][];
      const tagInfos: TagInfo[] = rows.map((row) => ({
        name: row[0] as string,
        displayName: row[1] as string,
        count: row[2] as number,
      }));
      
      return success(tagInfos);
    } catch (error) {
      return fail(`Failed to get tags with counts: ${(error as Error).message}`);
    }
  }

  /**
   * Renames a tag globally.
   */
  async function renameTag(oldName: string, newName: string): Promise<Result<void>> {
    try {
      const oldNormalized = normalizeTagName(oldName);
      const newNormalized = normalizeTagName(newName);

      // Check if old tag exists
      const checkStmt = db.prepare("SELECT id FROM tags WHERE name = ?");
      const existingRows = checkStmt.values(oldNormalized) as unknown[][];
      
      if (existingRows.length === 0) {
        return fail(`Tag "${oldName}" not found`);
      }

      // Check if new tag name already exists
      const conflictRows = checkStmt.values(newNormalized) as unknown[][];
      if (conflictRows.length > 0) {
        return fail(`Tag "${newName}" already exists`);
      }

      // Update tag
      const updateStmt = db.prepare("UPDATE tags SET name = ?, display_name = ? WHERE name = ?");
      updateStmt.run(newNormalized, newName.trim(), oldNormalized);

      return success(undefined);
    } catch (error) {
      return fail(`Failed to rename tag: ${(error as Error).message}`);
    }
  }

  /**
   * Deletes a tag globally (removes from all todos).
   */
  async function deleteTag(tagName: string): Promise<Result<void>> {
    try {
      const normalized = normalizeTagName(tagName);

      // Check if tag exists
      const stmt = db.prepare("SELECT id FROM tags WHERE name = ?");
      const existingRows = stmt.values(normalized) as unknown[][];
      
      if (existingRows.length === 0) {
        return fail(`Tag "${tagName}" not found`);
      }

      // Delete tag (cascade will remove from todo_tags)
      const deleteStmt = db.prepare("DELETE FROM tags WHERE name = ?");
      deleteStmt.run(normalized);

      return success(undefined);
    } catch (error) {
      return fail(`Failed to delete tag: ${(error as Error).message}`);
    }
  }

  return {
    save,
    findById,
    findAll,
    delete: deleteTodo,
    search,
    findByTag,
    getAllTags,
    getAllTagsWithCounts,
    renameTag,
    deleteTag,
  };
}
