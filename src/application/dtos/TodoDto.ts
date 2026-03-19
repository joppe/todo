import type { Todo } from "../../domain/types/Todo.ts";
import type { TodoId } from "../../domain/types/TodoId.ts";
import type { Priority } from "../../domain/types/Priority.ts";
import type { TodoStatus } from "../../domain/types/TodoStatus.ts";

/**
 * DTO for presenting todo data to the CLI layer.
 * Converts domain Todo to a serializable format.
 */
export type TodoDto = {
  readonly id: TodoId;
  readonly title: string;
  readonly description: string;
  readonly priority: Priority;
  readonly status: TodoStatus;
  readonly category: string | null;
  readonly dueDate: string | null; // ISO string
  readonly tags: readonly string[];
  readonly createdAt: string; // ISO string
  readonly completedAt: string | null; // ISO string
  readonly isOverdue: boolean;
};

/**
 * Converts a domain Todo entity to a TodoDto.
 * 
 * @param todo - The domain Todo entity
 * @returns TodoDto ready for presentation
 */
export function toDto(todo: Todo): TodoDto {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    status: todo.status,
    category: todo.category,
    dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
    tags: todo.tags,
    createdAt: todo.createdAt.toISOString(),
    completedAt: todo.completedAt ? todo.completedAt.toISOString() : null,
    isOverdue: todo.dueDate ? todo.dueDate < new Date() && todo.status === "pending" : false,
  };
}

/**
 * Converts an array of domain Todo entities to TodoDtos.
 * 
 * @param todos - Array of domain Todo entities
 * @returns Array of TodoDtos
 */
export function toDtoArray(todos: readonly Todo[]): readonly TodoDto[] {
  return todos.map(toDto);
}
