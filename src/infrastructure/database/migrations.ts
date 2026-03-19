import type { Database } from "@db/sqlite";

/**
 * Runs all database migrations.
 * Creates tables and indexes if they don't exist.
 * 
 * @param db - Database connection
 */
export function runMigrations(db: Database): void {
  createTodosTable(db);
  createTagsTable(db);
  createTodoTagsTable(db);
  createIndexes(db);
}

/**
 * Creates the todos table.
 */
function createTodosTable(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      priority TEXT NOT NULL CHECK(priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
      status TEXT NOT NULL CHECK(status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
      category TEXT,
      due_date TEXT,
      created_at TEXT NOT NULL,
      completed_at TEXT
    )
  `);
}

/**
 * Creates the tags table with normalized storage.
 * - name: lowercase for lookups
 * - display_name: original casing (first-used)
 */
function createTagsTable(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL
    )
  `);
}

/**
 * Creates the many-to-many junction table for todos and tags.
 */
function createTodoTagsTable(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS todo_tags (
      todo_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (todo_id, tag_id),
      FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `);
}

/**
 * Creates indexes for better query performance.
 */
function createIndexes(db: Database): void {
  // Index for todo_tags lookups by todo_id
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_todo_tags_todo_id 
    ON todo_tags(todo_id)
  `);

  // Index for todo_tags lookups by tag_id
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_todo_tags_tag_id 
    ON todo_tags(tag_id)
  `);

  // Index for tag name lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_tags_name 
    ON tags(name)
  `);

  // Index for todos by status
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_todos_status 
    ON todos(status)
  `);

  // Index for todos by priority
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_todos_priority 
    ON todos(priority)
  `);

  // Index for todos by category
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_todos_category 
    ON todos(category)
  `);
}
