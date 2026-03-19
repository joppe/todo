import { Table } from "@cliffy/table";
import type { TodoDto } from "../../../application/dtos/TodoDto.ts";
import type { TagInfo } from "../../../domain/repository.ts";
import { colorPriority, colorStatus, colorTag, muted } from "./colorFormatter.ts";
import { formatTodoRow, formatDueDate } from "./todoFormatter.ts";

/**
 * Creates a table displaying a list of todos.
 * 
 * @param todos - Array of TodoDtos to display
 * @returns Formatted table as string
 */
export function createTodoTable(todos: readonly TodoDto[]): string {
  if (todos.length === 0) {
    return muted("No todos found.");
  }

  const table = new Table()
    .header(["ID", "Title", "Priority", "Status", "Due Date", "Tags"])
    .body(todos.map(formatTodoRow));

  return table.toString();
}

/**
 * Creates a table displaying tag information.
 * 
 * @param tags - Array of TagInfo objects
 * @returns Formatted table as string
 */
export function createTagTable(tags: readonly TagInfo[]): string {
  if (tags.length === 0) {
    return muted("No tags found.");
  }

  const table = new Table()
    .header(["Tag", "Count"])
    .body(tags.map(tag => [
      colorTag(tag.displayName),
      tag.count.toString(),
    ]));

  return table.toString();
}

/**
 * Creates a detailed view of a single todo.
 * 
 * @param todo - TodoDto to display
 * @returns Formatted string with todo details
 */
export function createTodoDetails(todo: TodoDto): string {
  const lines: string[] = [];
  
  lines.push(`ID: ${todo.id}`);
  lines.push(`Title: ${todo.title}`);
  
  if (todo.description) {
    lines.push(`Description: ${todo.description}`);
  }
  
  lines.push(`Priority: ${colorPriority(todo.priority, todo.priority)}`);
  lines.push(`Status: ${colorStatus(todo.status, todo.status)}`);
  
  if (todo.category) {
    lines.push(`Category: ${todo.category}`);
  }
  
  if (todo.dueDate) {
    lines.push(`Due Date: ${formatDueDate(new Date(todo.dueDate), todo.status)}`);
  }
  
  if (todo.tags.length > 0) {
    lines.push(`Tags: ${todo.tags.map(colorTag).join(", ")}`);
  }
  
  lines.push(`Created: ${new Date(todo.createdAt).toLocaleString()}`);
  
  if (todo.completedAt) {
    lines.push(`Completed: ${new Date(todo.completedAt).toLocaleString()}`);
  }
  
  return lines.join("\n");
}
