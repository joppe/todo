import type { TodoRepository } from "../../domain/repository.ts";
import type { TodoId } from "../../domain/types/TodoId.ts";
import type { Todo } from "../../domain/types/Todo.ts";
import type { Result } from "../../shared/Result.ts";
import { fail } from "../../shared/Result.ts";

/**
 * Use case function type for getting a todo by ID.
 */
export type GetTodoByIdUseCase = (id: TodoId) => Promise<Result<Todo>>;

/**
 * Creates the getTodoById use case.
 * 
 * @param repository - TodoRepository for data access
 * @returns GetTodoByIdUseCase function
 * 
 * @example
 * const getTodoById = createGetTodoByIdUseCase(repository);
 * const result = await getTodoById(todoId);
 */
export function createGetTodoByIdUseCase(
  repository: TodoRepository,
): GetTodoByIdUseCase {
  return async function getTodoById(id: TodoId): Promise<Result<Todo>> {
    const result = await repository.findById(id);
    if (!result.success) {
      return fail(`Todo with ID ${id} not found`);
    }

    return result;
  };
}
