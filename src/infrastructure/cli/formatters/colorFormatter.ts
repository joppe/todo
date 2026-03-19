import { colors } from "@cliffy/ansi/colors";
import type { Priority } from "../../../domain/types/Priority.ts";
import type { TodoStatus } from "../../../domain/types/TodoStatus.ts";

/**
 * Colorizes text based on priority level.
 * 
 * @param priority - Priority level
 * @param text - Text to colorize
 * @returns Colorized text
 */
export function colorPriority(priority: Priority, text: string): string {
  switch (priority) {
    case "high":
      return colors.red(text);
    case "medium":
      return colors.yellow(text);
    case "low":
      return colors.cyan(text);
  }
}

/**
 * Colorizes text based on todo status.
 * 
 * @param status - Todo status
 * @param text - Text to colorize
 * @returns Colorized text
 */
export function colorStatus(status: TodoStatus, text: string): string {
  switch (status) {
    case "completed":
      return colors.green(text);
    case "cancelled":
      return colors.gray(text);
    case "pending":
      return text; // No color for pending
  }
}

/**
 * Colors text as success (green).
 */
export function success(text: string): string {
  return colors.green(text);
}

/**
 * Colors text as error (red).
 */
export function error(text: string): string {
  return colors.red(text);
}

/**
 * Colors text as warning (yellow).
 */
export function warning(text: string): string {
  return colors.yellow(text);
}

/**
 * Colors text as info (cyan).
 */
export function info(text: string): string {
  return colors.cyan(text);
}

/**
 * Makes text bold.
 */
export function strong(text: string): string {
  return colors.bold(text);
}

/**
 * Makes text dimmed/faded.
 */
export function muted(text: string): string {
  return colors.dim(text);
}

/**
 * Colors a tag for display.
 */
export function colorTag(tag: string): string {
  return colors.cyan(`#${tag}`);
}

/**
 * Colors an overdue indicator.
 */
export function colorOverdue(text: string): string {
  return colors.bold.red(text);
}
