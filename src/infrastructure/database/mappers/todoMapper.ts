import type { Todo } from "../../../domain/types/Todo.ts";
import type { Priority } from "../../../domain/types/Priority.ts";
import type { TodoStatus } from "../../../domain/types/TodoStatus.ts";
import type { Result } from "../../../shared/Result.ts";
import { fail } from "../../../shared/Result.ts";
import { createTodo } from "../../../domain/types/Todo.ts";
import { createTodoId } from "../../../domain/types/TodoId.ts";
import { isPriority } from "../../../domain/types/Priority.ts";
import { isTodoStatus } from "../../../domain/types/TodoStatus.ts";

/**
 * Database row representation of a todo.
 */
export type TodoRow = {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly priority: string;
  readonly status: string;
  readonly category: string | null;
  readonly due_date: string | null;
  readonly created_at: string;
  readonly completed_at: string | null;
};

/**
 * Maps a database row (and associated tags) to a domain Todo entity.
 * 
 * @param row - Database row array or object
 * @param tags - Array of tag display names for this todo
 * @returns Result containing Todo or error message
 */
export function toDomain(row: unknown[], tags: string[]): Result<Todo> {
  try {
    // Extract values from row array
    // Expected order: id, title, description, priority, status, category, due_date, created_at, completed_at
    const id = row[0] as number;
    const title = row[1] as string;
    const description = row[2] as string;
    const priority = row[3] as string;
    const status = row[4] as string;
    const category = row[5] as string | null;
    const dueDate = row[6] as string | null;
    const createdAt = row[7] as string;
    const completedAt = row[8] as string | null;

    // Validate and create TodoId
    const todoIdResult = createTodoId(id);
    if (!todoIdResult.success) {
      return fail(`Invalid todo ID: ${todoIdResult.error}`);
    }

    // Validate priority
    if (!isPriority(priority)) {
      return fail(`Invalid priority: ${priority}`);
    }

    // Validate status
    if (!isTodoStatus(status)) {
      return fail(`Invalid status: ${status}`);
    }

    // Parse dates
    const createdAtDate = new Date(createdAt);
    const dueDateObj = dueDate ? new Date(dueDate) : null;
    const completedAtDate = completedAt ? new Date(completedAt) : null;

    // Create the todo using the domain function
    return createTodo({
      id: todoIdResult.value,
      title,
      description,
      priority: priority as Priority,
      status: status as TodoStatus,
      category,
      dueDate: dueDateObj,
      tags,
      createdAt: createdAtDate,
      completedAt: completedAtDate,
    });
  } catch (error) {
    return fail(`Failed to map database row to Todo: ${(error as Error).message}`);
  }
}

/**
 * Maps a domain Todo entity to a database row representation.
 * Note: Tags are not included here - they're handled separately via the junction table.
 * 
 * @param todo - Todo entity to map
 * @returns Database row object
 */
export function toPersistence(todo: Todo): TodoRow {
  return {
    id: todo.id as number,
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    status: todo.status,
    category: todo.category,
    due_date: todo.dueDate ? todo.dueDate.toISOString() : null,
    created_at: todo.createdAt.toISOString(),
    completed_at: todo.completedAt ? todo.completedAt.toISOString() : null,
  };
}
