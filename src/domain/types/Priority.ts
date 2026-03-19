import type { Result } from "../../shared/Result.ts";
import { success, fail } from "../../shared/Result.ts";

/**
 * Priority levels for todos.
 */
export type Priority = "high" | "medium" | "low";

/**
 * All valid priority values.
 */
export const PRIORITIES: ReadonlyArray<Priority> = ["high", "medium", "low"] as const;

/**
 * Type guard for Priority.
 * 
 * @param value - Value to check
 * @returns True if value is a valid Priority
 */
export function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && PRIORITIES.includes(value as Priority);
}

/**
 * Creates a Priority from a string with validation.
 * 
 * @param value - String value to convert to Priority
 * @returns Result containing Priority or error message
 */
export function createPriority(value: string): Result<Priority> {
  const normalized = value.toLowerCase().trim();
  
  if (isPriority(normalized)) {
    return success(normalized);
  }
  
  return fail(`Invalid priority: ${value}. Must be one of: ${PRIORITIES.join(", ")}`);
}

/**
 * Gets the default priority.
 * 
 * @returns The default priority level
 */
export function getDefaultPriority(): Priority {
  return "medium";
}

/**
 * Compares priorities for sorting.
 * Returns positive if a should come before b (descending order: high > medium > low).
 * 
 * @param a - First priority
 * @param b - Second priority
 * @returns Comparison result for sorting
 */
export function comparePriorities(a: Priority, b: Priority): number {
  const order: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
  return order[b] - order[a];
}
