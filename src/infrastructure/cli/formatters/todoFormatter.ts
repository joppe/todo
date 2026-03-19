import type { TodoDto } from "../../../application/dtos/TodoDto.ts";
import type { Priority } from "../../../domain/types/Priority.ts";
import type { TodoStatus } from "../../../domain/types/TodoStatus.ts";
import { colorPriority, colorStatus, colorTag, colorOverdue, muted } from "./colorFormatter.ts";

/**
 * Formats a todo as a table row.
 * 
 * @param todo - TodoDto to format
 * @returns Array of strings representing table cells
 */
export function formatTodoRow(todo: TodoDto): string[] {
  return [
    todo.id.toString(),
    truncate(todo.title, 40),
    colorPriority(todo.priority, todo.priority),
    colorStatus(todo.status, todo.status),
    todo.dueDate ? formatDueDate(new Date(todo.dueDate), todo.status) : muted("-"),
    todo.tags.length > 0 ? todo.tags.slice(0, 3).map(colorTag).join(" ") : muted("-"),
  ];
}

/**
 * Formats a due date with overdue warning if applicable.
 * 
 * @param date - Due date
 * @param status - Todo status
 * @returns Formatted date string
 */
export function formatDueDate(date: Date, status: TodoStatus): string {
  const formatted = formatDate(date);
  const isOverdue = date < new Date() && status === "pending";
  
  if (isOverdue) {
    return colorOverdue(`${formatted} (OVERDUE)`);
  }
  
  return formatted;
}

/**
 * Formats a date in a human-readable way.
 * Shows relative dates for today/tomorrow/yesterday.
 * 
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays === -1) {
    return "Yesterday";
  } else if (diffDays > 1 && diffDays <= 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < -1 && diffDays >= -7) {
    return `${Math.abs(diffDays)} days ago`;
  }
  
  // For dates further away, show the actual date
  return date.toLocaleDateString();
}

/**
 * Truncates text to a maximum length with ellipsis.
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Formats priority as a badge-style string.
 * 
 * @param priority - Priority level
 * @returns Formatted priority string
 */
export function formatPriority(priority: Priority): string {
  return colorPriority(priority, priority.toUpperCase());
}

/**
 * Formats status as a badge-style string.
 * 
 * @param status - Todo status
 * @returns Formatted status string
 */
export function formatStatus(status: TodoStatus): string {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return colorStatus(status, label);
}
