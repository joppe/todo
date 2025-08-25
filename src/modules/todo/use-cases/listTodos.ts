import type { TodoRepository } from "../data-access/TodoRepository.ts";
import type { SortableDirection, SortableField, Todo } from "../entity/Todo.ts";

export type MakeListTodosProps = {
  todoRepository: TodoRepository;
  sortableFields: SortableField[];
  sortableDirections: SortableDirection[];
};

export type ListTodosProps = {
  sortBy?: string;
  direction?: string;
};
export type ListTodos = (props: ListTodosProps) => Promise<Todo[]>;

export function makeListTodos({
  todoRepository,
  sortableFields,
  sortableDirections,
}: MakeListTodosProps): ListTodos {
  return async function listTodos(
    { sortBy, direction },
  ): Promise<Todo[]> {
    if (sortBy && !(sortableFields as string[]).includes(sortBy)) {
      throw new Error("Invalid sort field");
    }

    if (direction && !(sortableDirections as string[]).includes(direction)) {
      throw new Error("Invalid sort direction");
    }

    const sortByField = (sortBy ?? "created") as SortableField;
    const sortDirection = (direction ?? "asc") as SortableDirection;

    try {
      const todos = await todoRepository.findAll(sortByField, sortDirection);

      return todos;
    } catch (_) {
      throw new Error("Failed to list todos");
    }
  };
}
