import type { Priority } from "../../domain/types/Priority.ts";
import type { TodoStatus } from "../../domain/types/TodoStatus.ts";

/**
 * DTO for filtering todos.
 * All fields are optional - only specified filters will be applied.
 */
export type TodoFilterDto = {
  readonly status?: TodoStatus;
  readonly priority?: Priority;
  readonly category?: string;
  readonly tag?: string; // Filter by a specific tag
  readonly overdue?: boolean; // Show only overdue todos
};
