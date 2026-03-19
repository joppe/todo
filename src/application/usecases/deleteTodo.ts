import type { TodoRepository } from "../../domain/repository.ts";
import type { TodoId } from "../../domain/types/TodoId.ts";
import type { Result } from "../../shared/Result.ts";
import { fail, success } from "../../shared/Result.ts";

/**
 * Use case function type for deleting a todo.
 */
export type DeleteTodoUseCase = (id: TodoId) => Promise<Result<void>>;

/**
 * Creates the deleteTodo use case.
 * 
 * @param repository - TodoRepository for persistence
 * @returns DeleteTodoUseCase function
 * 
 * @example
 * const deleteTodo = createDeleteTodoUseCase(repository);
 * const result = await deleteTodo(todoId);
 */
export function createDeleteTodoUseCase(
  repository: TodoRepository,
): DeleteTodoUseCase {
  return async function deleteTodo(id: TodoId): Promise<Result<void>> {
    // Check if todo exists
    const todoResult = await repository.findById(id);
    if (!todoResult.success) {
      return fail(`Todo with ID ${id} not found`);
    }

    // Delete the todo
    const deleteResult = await repository.delete(id);
    if (!deleteResult.success) {
      return fail(`Failed to delete todo: ${deleteResult.error}`);
    }

    return success(undefined);
  };
}
