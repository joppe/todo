import type { TodoRepository } from "../data-access/TodoRepository.ts";
import type { SortableDirection, SortableField, Todo } from "../entity/Todo.ts";

export type MakeListTodosProps = {
  todoRepository: TodoRepository;
  sortableFields: SortableField[];
  sortableDirections: SortableDirection[];
};

export type ListTodosProps = {
  sort?: SortableField;
  direction?: SortableDirection;
};
export type ListTodos = (props: ListTodosProps) => Promise<Todo[]>;

export function makeListTodos({
  todoRepository,
  sortableFields,
  sortableDirections,
}: MakeListTodosProps): ListTodos {
  return async function listTodos(
    { sort, direction },
  ): Promise<Todo[]> {
    if (sort && !sortableFields.includes(sort)) {
      throw new Error("Invalid sort field");
    }

    if (direction && !sortableDirections.includes(direction)) {
      throw new Error("Invalid sort direction");
    }

    const sortField = sort ?? "created";
    const sortDirection = direction ?? "asc";

    try {
      const todos = await todoRepository.findAll({
        sort: sortField,
        direction: sortDirection,
      });

      return todos;
    } catch (_) {
      throw new Error("Failed to list todos");
    }
  };
}
