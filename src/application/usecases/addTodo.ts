import type { TodoRepository } from "../../domain/repository.ts";
import type { CreateTodoDto } from "../dtos/CreateTodoDto.ts";
import type { Todo } from "../../domain/types/Todo.ts";
import type { Result } from "../../shared/Result.ts";
import { fail, success } from "../../shared/Result.ts";
import { createTodo } from "../../domain/types/Todo.ts";
import { createTodoId } from "../../domain/types/TodoId.ts";
import { parseDate } from "../../shared/dateParser.ts";

/**
 * Use case function type for adding a new todo.
 */
export type AddTodoUseCase = (dto: CreateTodoDto) => Promise<Result<Todo>>;

/**
 * Creates the addTodo use case.
 * 
 * @param repository - TodoRepository for persistence
 * @returns AddTodoUseCase function
 * 
 * @example
 * const addTodo = createAddTodoUseCase(repository);
 * const result = await addTodo({
 *   title: "Write tests",
 *   priority: "high",
 *   tags: ["testing", "urgent"]
 * });
 */
export function createAddTodoUseCase(
  repository: TodoRepository,
): AddTodoUseCase {
  return async function addTodo(dto: CreateTodoDto): Promise<Result<Todo>> {
    // Parse due date if provided
    let dueDate: Date | null = null;
    if (dto.dueDate) {
      const parseDateResult = parseDate(dto.dueDate);
      if (!parseDateResult.success) {
        return fail(`Invalid due date: ${parseDateResult.error}`);
      }
      dueDate = parseDateResult.value;
    }

    // Create temporary id (will be replaced by database auto-increment)
    // We use 0 as a placeholder for new todos
    const tempIdResult = createTodoId(0);
    if (!tempIdResult.success) {
      return fail("Failed to create temporary todo ID");
    }

    // Create the todo entity using domain function
    const todoResult = createTodo({
      id: tempIdResult.value,
      title: dto.title,
      description: dto.description || "",
      priority: dto.priority || "medium",
      status: "pending",
      category: dto.category || null,
      dueDate,
      tags: dto.tags || [],
      createdAt: new Date(),
      completedAt: null,
    });

    if (!todoResult.success) {
      return fail(todoResult.error);
    }

    // Persist the todo (repository will assign proper ID)
    const saveResult = await repository.save(todoResult.value);
    if (!saveResult.success) {
      return fail(`Failed to save todo: ${saveResult.error}`);
    }

    return success(saveResult.value);
  };
}
