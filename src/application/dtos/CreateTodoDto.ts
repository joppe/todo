import type { Priority } from "../../domain/types/Priority.ts";

/**
 * DTO for creating a new todo.
 * Contains only the data needed from the user to create a todo.
 */
export type CreateTodoDto = {
  readonly title: string;
  readonly description?: string;
  readonly priority?: Priority;
  readonly category?: string;
  readonly dueDate?: string; // ISO string or natural language (e.g., "today", "tomorrow")
  readonly tags?: string[]; // Array of tag names
};
