import type { SortableDirection, SortableField, Todo } from "../entity/Todo.ts";

export type FindAllProps = {
  sort: SortableField;
  direction: SortableDirection;
};

export type TodoRepository = {
  insert: (data: Omit<Todo, "id">) => Promise<Todo>;
  update: (
    id: string,
    data: Pick<Todo, "title" | "description" | "deadline">,
  ) => Promise<Todo>;
  remove: (id: string) => Promise<void>;
  find: (id: string) => Promise<Todo>;
  findAll: (
    { sort, direction }: FindAllProps,
  ) => Promise<Todo[]>;
  toggle: (id: string) => Promise<Todo>;
};
