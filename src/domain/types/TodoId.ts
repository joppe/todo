import type { Result } from "../../shared/Result.ts";
import { success, fail } from "../../shared/Result.ts";

/**
 * TodoId represents a unique identifier for a todo.
 * Uses a branded type pattern to ensure type safety.
 */
export type TodoId = number & { readonly __brand: "TodoId" };

/**
 * Type guard for TodoId.
 * 
 * @param value - Value to check
 * @returns True if value is a valid TodoId
 */
export function isTodoId(value: unknown): value is TodoId {
  return typeof value === "number" && value >= 0 && Number.isInteger(value);
}

/**
 * Creates a TodoId from a number with validation.
 * 
 * @param value - Number to convert to TodoId
 * @returns Result containing TodoId or error message
 */
export function createTodoId(value: number): Result<TodoId> {
  if (!Number.isInteger(value)) {
    return fail("Todo ID must be an integer");
  }
  
  if (value < 0) {
    return fail("Todo ID must be non-negative");
  }
  
  return success(value as TodoId);
}

/**
 * Converts a TodoId to a number for database operations.
 * 
 * @param id - TodoId to convert
 * @returns The numeric value
 */
export function todoIdToNumber(id: TodoId): number {
  return id as number;
}
