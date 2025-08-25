import { ListTodoPresenter } from "../presenter/ListTodoPresenter.ts";
import { ListTodos, ListTodosProps } from "../use-cases/listTodos.ts";

export type CliListTodoControllerProps = ListTodosProps & {
  fields?: string[];
};

export type CliListTodoController = (
  props: CliListTodoControllerProps,
) => Promise<string>;

export type MakeCliListTodoControllerProps = {
  presenter: ListTodoPresenter;
  listTodos: ListTodos;
};

export function makeCliListTodoController(
  { presenter, listTodos }: MakeCliListTodoControllerProps,
): CliListTodoController {
  return async function cliListTodoController(
    { sortBy, direction, fields = ["id", "title"] },
  ) {
    const todos = await listTodos({ sortBy, direction });

    return presenter(todos, fields);
  };
}
