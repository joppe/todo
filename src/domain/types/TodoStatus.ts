import type { Result } from "../../shared/Result.ts";
import { success, fail } from "../../shared/Result.ts";

/**
 * Status of a todo item.
 */
export type TodoStatus = "pending" | "completed" | "cancelled";

/**
 * All valid status values.
 */
export const TODO_STATUSES: ReadonlyArray<TodoStatus> = [
  "pending",
  "completed",
  "cancelled",
] as const;

/**
 * Type guard for TodoStatus.
 * 
 * @param value - Value to check
 * @returns True if value is a valid TodoStatus
 */
export function isTodoStatus(value: unknown): value is TodoStatus {
  return typeof value === "string" && TODO_STATUSES.includes(value as TodoStatus);
}

/**
 * Creates a TodoStatus from a string with validation.
 * 
 * @param value - String value to convert to TodoStatus
 * @returns Result containing TodoStatus or error message
 */
export function createTodoStatus(value: string): Result<TodoStatus> {
  const normalized = value.toLowerCase().trim();
  
  if (isTodoStatus(normalized)) {
    return success(normalized);
  }
  
  return fail(`Invalid status: ${value}. Must be one of: ${TODO_STATUSES.join(", ")}`);
}

/**
 * Gets the default todo status.
 * 
 * @returns The default status
 */
export function getDefaultStatus(): TodoStatus {
  return "pending";
}

/**
 * Checks if a status represents a completed todo.
 * 
 * @param status - Status to check
 * @returns True if the status is completed
 */
export function isCompletedStatus(status: TodoStatus): boolean {
  return status === "completed";
}

/**
 * Checks if a status represents a pending todo.
 * 
 * @param status - Status to check
 * @returns True if the status is pending
 */
export function isPendingStatus(status: TodoStatus): boolean {
  return status === "pending";
}

/**
 * Checks if a status represents a cancelled todo.
 * 
 * @param status - Status to check
 * @returns True if the status is cancelled
 */
export function isCancelledStatus(status: TodoStatus): boolean {
  return status === "cancelled";
}
