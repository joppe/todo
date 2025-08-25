import { Todo } from "../entity/Todo.ts";
import { ListTodoPresenter } from "./ListTodoPresenter.ts";

export function makeTextListTodoPresenter(): ListTodoPresenter {
  return function textListTodoPresenter(
    todos: Todo[],
    fields?: string[],
  ): string {
    if (todos.length === 0) {
      return "No todos found";
    }

    return todos
      .map((todo) => {
        if (fields === undefined) {
          return todo;
        }

        return fields.map((field) => {
          if (!(field in todo)) {
            throw new Error(`Unknown field "${field}"`);
          }

          return String(todo[field as keyof Todo]);
        }).join(" | ");
      })
      .join("\n");
  };
}
