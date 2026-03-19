import type { TodoRepository } from "../../domain/repository.ts";
import type { TodoFilterDto } from "../dtos/TodoFilterDto.ts";
import type { Todo } from "../../domain/types/Todo.ts";
import type { Result } from "../../shared/Result.ts";
import { fail } from "../../shared/Result.ts";

/**
 * Use case function type for listing todos with optional filters.
 */
export type ListTodosUseCase = (filter?: TodoFilterDto) => Promise<Result<readonly Todo[]>>;

/**
 * Creates the listTodos use case.
 * 
 * @param repository - TodoRepository for data access
 * @returns ListTodosUseCase function
 * 
 * @example
 * const listTodos = createListTodosUseCase(repository);
 * const result = await listTodos({ status: "pending", priority: "high" });
 */
export function createListTodosUseCase(
  repository: TodoRepository,
): ListTodosUseCase {
  return async function listTodos(filter?: TodoFilterDto): Promise<Result<readonly Todo[]>> {
    // If filtering by tag, use findByTag
    if (filter?.tag) {
      const result = await repository.findByTag(filter.tag);
      if (!result.success) {
        return fail(`Failed to list todos by tag: ${result.error}`);
      }
      
      // Apply additional filters in-memory
      let todos = result.value;
      
      if (filter.status) {
        todos = todos.filter(todo => todo.status === filter.status);
      }
      
      if (filter.priority) {
        todos = todos.filter(todo => todo.priority === filter.priority);
      }
      
      if (filter.category) {
        todos = todos.filter(todo => todo.category === filter.category);
      }
      
      if (filter.overdue) {
        const now = new Date();
        todos = todos.filter(todo => 
          todo.dueDate && todo.dueDate < now && todo.status === "pending"
        );
      }
      
      return { success: true, value: todos };
    }

    // Otherwise, get all todos and filter in-memory
    const result = await repository.findAll();
    if (!result.success) {
      return fail(`Failed to list todos: ${result.error}`);
    }

    let todos = result.value;

    // Apply filters if provided
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
