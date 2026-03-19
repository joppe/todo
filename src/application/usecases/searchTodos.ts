import type { TodoRepository } from "../../domain/repository.ts";
import type { TodoFilterDto } from "../dtos/TodoFilterDto.ts";
import type { Todo } from "../../domain/types/Todo.ts";
import type { Result } from "../../shared/Result.ts";
import { fail } from "../../shared/Result.ts";

/**
 * Use case function type for searching todos.
 */
export type SearchTodosUseCase = (query: string, filter?: TodoFilterDto) => Promise<Result<readonly Todo[]>>;

/**
 * Creates the searchTodos use case.
 * 
 * @param repository - TodoRepository for data access
 * @returns SearchTodosUseCase function
 * 
 * @example
 * const searchTodos = createSearchTodosUseCase(repository);
 * const result = await searchTodos("meeting", { status: "pending" });
 */
export function createSearchTodosUseCase(
  repository: TodoRepository,
): SearchTodosUseCase {
  return async function searchTodos(
    query: string,
    filter?: TodoFilterDto,
  ): Promise<Result<readonly Todo[]>> {
    // Search using repository
    const searchResult = await repository.search(query);
    if (!searchResult.success) {
      return fail(`Failed to search todos: ${searchResult.error}`);
    }

    let todos = searchResult.value;

    // Apply additional filters if provided
    if (filter) {
      if (filter.status) {
        todos = todos.filter(todo => todo.status === filter.status);
      }
      
      if (filter.priority) {
        todos = todos.filter(todo => todo.priority === filter.priority);
      }
      
      if (filter.category) {
        todos = todos.filter(todo => todo.category === filter.category);
      }
      
      if (filter.tag) {
        todos = todos.filter(todo => todo.tags.includes(filter.tag!));
      }
      
      if (filter.overdue) {
        const now = new Date();
        todos = todos.filter(todo => 
          todo.dueDate && todo.dueDate < now && todo.status === "pending"
        );
      }
    }

    return { success: true, value: todos };
  };
}
