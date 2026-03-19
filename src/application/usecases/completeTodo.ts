import type { TodoRepository } from "../../domain/repository.ts";
import type { TodoId } from "../../domain/types/TodoId.ts";
import type { Result } from "../../shared/Result.ts";
import { fail, success } from "../../shared/Result.ts";
import { completeTodo as completeTodoEntity } from "../../domain/types/Todo.ts";

/**
 * Use case function type for completing a todo.
 */
export type CompleteTodoUseCase = (id: TodoId) => Promise<Result<void>>;

/**
 * Creates the completeTodo use case.
 * 
 * @param repository - TodoRepository for persistence
 * @returns CompleteTodoUseCase function
 * 
 * @example
 * const completeTodo = createCompleteTodoUseCase(repository);
 * const result = await completeTodo(todoId);
 */
export function createCompleteTodoUseCase(
  repository: TodoRepository,
): CompleteTodoUseCase {
  return async function completeTodo(id: TodoId): Promise<Result<void>> {
    // Fetch the todo
    const todoResult = await repository.findById(id);
    if (!todoResult.success) {
      return fail(`Todo with ID ${id} not found`);
    }

    // Complete the todo using domain function
    const completedResult = completeTodoEntity(todoResult.value);
    if (!completedResult.success) {
      return fail(completedResult.error);
    }

    // Save the updated todo
    const saveResult = await repository.save(completedResult.value);
    if (!saveResult.success) {
      return fail(`Failed to complete todo: ${saveResult.error}`);
    }

    return success(undefined);
  };
}
