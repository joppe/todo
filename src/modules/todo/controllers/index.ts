import { textListTodoPresenter } from "../presenter/index.ts";
import { listTodos } from "../use-cases/index.ts";
import { makeCliListTodoController } from "./cli/cliListTodoController.ts";

export const listTodoController = makeCliListTodoController({
  presenter: textListTodoPresenter,
  listTodos: listTodos,
});
