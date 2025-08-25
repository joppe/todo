import { textListTodoPresenter } from "../presenter/index.ts";
import { listTodos } from "../use-cases/index.ts";
import { makeCliListTodoController } from "./cliListTodoController.ts";

export const cliListTodoController = makeCliListTodoController({
  presenter: textListTodoPresenter,
  listTodos: listTodos,
});
