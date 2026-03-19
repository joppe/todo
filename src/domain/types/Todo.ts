import type { Priority } from "./Priority.ts";
import type { TodoStatus } from "./TodoStatus.ts";
import type { DueDate } from "./DueDate.ts";
import type { TodoId } from "./TodoId.ts";
import type { Result } from "../../shared/Result.ts";
import { success, fail } from "../../shared/Result.ts";
import { getDefaultPriority } from "./Priority.ts";
import { getDefaultStatus, isCompletedStatus } from "./TodoStatus.ts";
import { isPast } from "./DueDate.ts";

/**
 * Todo entity representing a task to be completed.
 * Immutable data structure - all modifications return new instances.
 */
export type Todo = {
  readonly id: TodoId;
  readonly title: string;
  readonly description: string;
  readonly priority: Priority;
  readonly status: TodoStatus;
  readonly dueDate: DueDate | null;
  readonly category: string | null;
  readonly tags: ReadonlyArray<string>;
  readonly createdAt: Date;
  readonly completedAt: Date | null;
};

/**
 * Properties for creating a new Todo.
 * Only id and title are required.
 */
export type CreateTodoProps = {
  readonly id: TodoId;
  readonly title: string;
  readonly description?: string;
  readonly priority?: Priority;
  readonly status?: TodoStatus;
  readonly dueDate?: DueDate | null;
  readonly category?: string | null;
  readonly tags?: ReadonlyArray<string>;
  readonly createdAt?: Date;
  readonly completedAt?: Date | null;
};

/**
 * Maximum length for todo title.
 */
const MAX_TITLE_LENGTH = 200;

/**
 * Maximum length for todo description.
 */
const MAX_DESCRIPTION_LENGTH = 2000;

/**
 * Creates a new Todo with validation.
 * This is the primary way to construct a Todo entity.
 * 
 * @param props - Properties for the new todo
 * @returns Result containing Todo or validation error
 */
export function createTodo(props: CreateTodoProps): Result<Todo> {
  const trimmedTitle = props.title.trim();
  
  if (trimmedTitle.length === 0) {
    return fail("Title cannot be empty");
  }
  
  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    return fail(`Title cannot exceed ${MAX_TITLE_LENGTH} characters`);
  }

  const description = props.description?.trim() ?? "";
  
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return fail(`Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`);
  }

  return success({
    id: props.id,
    title: trimmedTitle,
    description,
    priority: props.priority ?? getDefaultPriority(),
    status: props.status ?? getDefaultStatus(),
    dueDate: props.dueDate ?? null,
    category: props.category?.trim() || null,
    tags: props.tags ?? [],
    createdAt: props.createdAt ?? new Date(),
    completedAt: props.completedAt ?? null,
  });
}

/**
 * Marks a todo as completed.
 * Returns a new Todo instance (immutable update).
 * 
 * @param todo - Todo to complete
 * @returns Result containing updated Todo or error
 */
export function completeTodo(todo: Todo): Result<Todo> {
  if (isCompletedStatus(todo.status)) {
    return fail("Todo is already completed");
  }

  return success({
    ...todo,
    status: "completed",
    completedAt: new Date(),
  });
}

/**
 * Marks a todo as cancelled.
 * Returns a new Todo instance (immutable update).
 * 
 * @param todo - Todo to cancel
 * @returns Result containing updated Todo or error
 */
export function cancelTodo(todo: Todo): Result<Todo> {
  if (isCompletedStatus(todo.status)) {
    return fail("Cannot cancel a completed todo");
  }

  return success({
    ...todo,
    status: "cancelled",
  });
}

/**
 * Reopens a completed or cancelled todo.
 * Returns a new Todo instance (immutable update).
 * 
 * @param todo - Todo to reopen
 * @returns Result containing updated Todo or error
 */
export function reopenTodo(todo: Todo): Result<Todo> {
  if (todo.status === "pending") {
    return fail("Todo is already pending");
  }

  return success({
    ...todo,
    status: "pending",
    completedAt: null,
  });
}

/**
 * Updates the title of a todo.
 * Returns a new Todo instance (immutable update).
 * 
 * @param todo - Todo to update
 * @param title - New title
 * @returns Result containing updated Todo or error
 */
export function updateTitle(todo: Todo, title: string): Result<Todo> {
  const trimmedTitle = title.trim();
  
  if (trimmedTitle.length === 0) {
    return fail("Title cannot be empty");
  }
  
  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    return fail(`Title cannot exceed ${MAX_TITLE_LENGTH} characters`);
  }

  return success({
    ...todo,
    title: trimmedTitle,
  });
}

/**
 * Updates the description of a todo.
 * Returns a new Todo instance (immutable update).
 * 
 * @param todo - Todo to update
 * @param description - New description
 * @returns Result containing updated Todo or error
 */
export function updateDescription(todo: Todo, description: string): Result<Todo> {
  const trimmedDescription = description.trim();
  
  if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
    return fail(`Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`);
  }

  return success({
    ...todo,
    description: trimmedDescription,
  });
}

/**
 * Updates the priority of a todo.
 * Returns a new Todo instance (immutable update).
 * 
 * @param todo - Todo to update
 * @param priority - New priority
 * @returns Result containing updated Todo
 */
export function updatePriority(todo: Todo, priority: Priority): Result<Todo> {
  return success({
    ...todo,
    priority,
  });
}

/**
 * Updates the due date of a todo.
 * Returns a new Todo instance (immutable update).
 * 
 * @param todo - Todo to update
 * @param dueDate - New due date (or null to remove)
 * @returns Result containing updated Todo
 */
export function updateDueDate(todo: Todo, dueDate: DueDate | null): Result<Todo> {
  return success({
    ...todo,
    dueDate,
  });
}

/**
 * Updates the category of a todo.
 * Returns a new Todo instance (immutable update).
 * 
 * @param todo - Todo to update
 * @param category - New category (or null to remove)
 * @returns Result containing updated Todo
 */
export function updateCategory(todo: Todo, category: string | null): Result<Todo> {
  return success({
    ...todo,
    category: category?.trim() || null,
  });
}

/**
 * Updates the tags of a todo.
 * Returns a new Todo instance (immutable update).
 * 
 * @param todo - Todo to update
 * @param tags - New tags array
 * @returns Result containing updated Todo
 */
export function updateTags(todo: Todo, tags: ReadonlyArray<string>): Result<Todo> {
  return success({
    ...todo,
    tags,
  });
}

/**
 * Checks if a todo is overdue.
 * A todo is overdue if it has a due date in the past and is not completed.
 * 
 * @param todo - Todo to check
 * @returns True if the todo is overdue
 */
export function isOverdue(todo: Todo): boolean {
  if (isCompletedStatus(todo.status) || !todo.dueDate) {
    return false;
  }
  return isPast(todo.dueDate);
}

/**
 * Checks if a todo has a specific tag.
 * 
 * @param todo - Todo to check
 * @param tag - Tag to search for (case-insensitive)
 * @returns True if the todo has the tag
 */
export function hasTag(todo: Todo, tag: string): boolean {
  const normalizedTag = tag.toLowerCase();
  return todo.tags.some((t) => t.toLowerCase() === normalizedTag);
}

/**
 * Checks if a todo matches a search query.
 * Searches in title, description, category, and tags.
 * 
 * @param todo - Todo to check
 * @param query - Search query (case-insensitive)
 * @returns True if the todo matches the query
 */
export function matchesQuery(todo: Todo, query: string): boolean {
  const normalizedQuery = query.toLowerCase();
  
  return todo.title.toLowerCase().includes(normalizedQuery) ||
    todo.description.toLowerCase().includes(normalizedQuery) ||
    (todo.category?.toLowerCase().includes(normalizedQuery) ?? false) ||
    todo.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
}
