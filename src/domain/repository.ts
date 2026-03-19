import type { Todo } from "./types/Todo.ts";
import type { TodoId } from "./types/TodoId.ts";
import type { TodoStatus } from "./types/TodoStatus.ts";
import type { Priority } from "./types/Priority.ts";
import type { Result } from "../shared/Result.ts";

/**
 * Filter options for querying todos.
 */
export type TodoFilter = {
  readonly status?: TodoStatus;
  readonly priority?: Priority;
  readonly category?: string;
  readonly tag?: string;
  readonly overdue?: boolean;
};

/**
 * Information about a tag including usage count.
 */
export type TagInfo = {
  readonly name: string;
  readonly displayName: string;
  readonly count: number;
};

/**
 * Repository for persisting and retrieving todos.
 * All operations return Results to handle errors gracefully.
 */
export type TodoRepository = {
  /**
   * Saves a new todo or updates an existing one.
   */
  readonly save: (todo: Todo) => Promise<Result<Todo>>;

  /**
   * Finds a todo by its ID.
   */
  readonly findById: (id: TodoId) => Promise<Result<Todo>>;

  /**
   * Finds all todos matching the filter.
   * If no filter is provided, returns all todos.
   */
  readonly findAll: (filter?: TodoFilter) => Promise<Result<ReadonlyArray<Todo>>>;

  /**
   * Deletes a todo by its ID.
   */
  readonly delete: (id: TodoId) => Promise<Result<void>>;

  /**
   * Searches todos by query string.
   * Searches in title, description, category, and tags.
   */
  readonly search: (
    query: string,
    filter?: TodoFilter,
  ) => Promise<Result<ReadonlyArray<Todo>>>;

  /**
   * Finds todos that have a specific tag.
   */
  readonly findByTag: (tagName: string) => Promise<Result<ReadonlyArray<Todo>>>;

  /**
   * Gets all tags in the system.
   * Returns display names (first-used casing).
   */
  readonly getAllTags: () => Promise<Result<ReadonlyArray<string>>>;

  /**
   * Gets all tags with usage counts.
   * Useful for showing tag statistics.
   */
  readonly getAllTagsWithCounts: () => Promise<Result<ReadonlyArray<TagInfo>>>;

  /**
   * Renames a tag globally.
   * Updates all todos that use the old tag name.
   */
  readonly renameTag: (oldName: string, newName: string) => Promise<Result<void>>;

  /**
   * Deletes a tag.
   * Removes the tag from all todos that use it.
   */
  readonly deleteTag: (name: string) => Promise<Result<void>>;
};
