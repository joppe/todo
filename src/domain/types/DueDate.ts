import type { Result } from "../../shared/Result.ts";
import { success, fail } from "../../shared/Result.ts";

/**
 * DueDate represents a date by which a todo should be completed.
 * Stored as a Date object for easy comparison and manipulation.
 */
export type DueDate = Date;

/**
 * Creates a DueDate from a Date object.
 * 
 * @param date - Date to use as due date
 * @returns Result containing DueDate or error message
 */
export function createDueDate(date: Date): Result<DueDate> {
  if (!(date instanceof Date)) {
    return fail("Invalid date object");
  }
  
  if (isNaN(date.getTime())) {
    return fail("Invalid date value");
  }
  
  return success(date);
}

/**
 * Creates a DueDate from an ISO string (YYYY-MM-DD).
 * 
 * @param isoString - ISO date string
 * @returns Result containing DueDate or error message
 */
export function createDueDateFromISOString(isoString: string): Result<DueDate> {
  try {
    const date = new Date(isoString);
    return createDueDate(date);
  } catch {
    return fail(`Invalid ISO date string: ${isoString}`);
  }
}

/**
 * Checks if a due date is in the past (overdue).
 * 
 * @param dueDate - Due date to check
 * @returns True if the date is in the past
 */
export function isPast(dueDate: DueDate): boolean {
  const now = new Date();
  // Compare only the date part (ignore time)
  const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return dueDateOnly < nowDateOnly;
}

/**
 * Checks if a due date is today.
 * 
 * @param dueDate - Due date to check
 * @returns True if the date is today
 */
export function isToday(dueDate: DueDate): boolean {
  const now = new Date();
  return dueDate.getFullYear() === now.getFullYear() &&
    dueDate.getMonth() === now.getMonth() &&
    dueDate.getDate() === now.getDate();
}

/**
 * Formats a due date as an ISO string (YYYY-MM-DD).
 * 
 * @param dueDate - Due date to format
 * @returns ISO date string
 */
export function formatDueDate(dueDate: DueDate): string {
  const isoString = dueDate.toISOString();
  const datePart = isoString.substring(0, 10);
  return datePart;
}
