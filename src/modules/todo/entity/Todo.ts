export type Todo = {
  id: string;
  title: string;
  description: string;
  done: boolean;
  deadline: Date | null;
  created: Date;
  updated: Date;
};

export type SortableField = keyof Todo;

export type SortableDirection = "asc" | "desc";

export const SORTABLE_FIELDS: SortableField[] = [
  "title",
  "description",
  "done",
  "deadline",
  "created",
  "updated",
] as const;

export const SORTABLE_DIRECTIONS: SortableDirection[] = [
  "asc",
  "desc",
] as const;
