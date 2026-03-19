import type { Result } from "./Result.ts";
import { success, fail } from "./Result.ts";

/**
 * Parses a date string into a Date object.
 * Supports both ISO format (YYYY-MM-DD) and natural language.
 * 
 * Natural language supported:
 * - "today"
 * - "tomorrow"
 * - "next week"
 * 
 * @param input - Date string to parse
 * @returns Result containing Date or error message
 */
export function parseDate(input: string): Result<Date> {
  const normalized = input.trim().toLowerCase();

  // Handle natural language dates
  if (normalized === "today") {
    return success(getToday());
  }

  if (normalized === "tomorrow") {
    return success(getTomorrow());
  }

  if (normalized === "next week") {
    return success(getNextWeek());
  }

  // Try to parse as ISO date or other standard format
  try {
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      return fail(
        `Invalid date: "${input}". Use YYYY-MM-DD format or natural language (today, tomorrow, next week)`,
      );
    }
    return success(date);
  } catch {
    return fail(
      `Invalid date: "${input}". Use YYYY-MM-DD format or natural language (today, tomorrow, next week)`,
    );
  }
}

/**
 * Gets today's date at midnight.
 * 
 * @returns Today's date
 */
function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Gets tomorrow's date at midnight.
 * 
 * @returns Tomorrow's date
 */
function getTomorrow(): Date {
  const today = getToday();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

/**
 * Gets the date one week from today.
 * 
 * @returns Date one week from now
 */
function getNextWeek(): Date {
  const today = getToday();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek;
}

/**
 * Formats a date as a human-readable string.
 * 
 * @param date - Date to format
 * @returns Formatted date string (e.g., "2026-03-14")
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a date relative to today.
 * 
 * @param date - Date to format
 * @returns Relative date string (e.g., "today", "tomorrow", "in 3 days", "2026-03-14")
 */
export function formatRelativeDate(date: Date): string {
  const today = getToday();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "today";
  }

  if (diffDays === 1) {
    return "tomorrow";
  }

  if (diffDays === -1) {
    return "yesterday";
  }

  if (diffDays > 1 && diffDays <= 7) {
    return `in ${diffDays} days`;
  }

  if (diffDays < -1 && diffDays >= -7) {
    return `${Math.abs(diffDays)} days ago`;
  }

  return formatDate(date);
}
