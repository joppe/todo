import { Todo } from "../../entity/Todo.ts";
import { ListTodoPresenter } from "../ListTodoPresenter.ts";

const FIELD_LENGTHS: Record<keyof Todo, number> = {
  id: 36,
  title: 20,
  description: 20,
  done: 5,
  deadline: 10,
  created: 10,
  updated: 10,
};

type PadDirection = "start" | "end";

function formatter(
  field: keyof Todo,
  content: string,
  padDirection: PadDirection = "end",
): string {
  const length = FIELD_LENGTHS[field];

  if (content.length > length) {
    return content.slice(0, length - 3) + "...";
  }

  if (padDirection === "end") {
    return content.padEnd(length, " ");
  }

  return content.padStart(length, " ");
}

function doneToString(done: boolean): string {
  return done ? "v" : "x";
}

function deadlineToString(deadline: Date | null): string {
  if (!deadline) {
    return "--";
  }

  return deadline.toLocaleDateString();
}

function fieldToString<Field extends keyof Todo>(
  field: Field,
  value: Todo[Field],
): string {
  switch (field) {
    case "done":
      return doneToString(value as boolean);
    case "deadline":
      return deadlineToString(value as Date | null);
    default:
      return String(value);
  }
}

const SEPERATOR = "|";

export function makeTextListTodoPresenter(): ListTodoPresenter {
  return function textListTodoPresenter(
    todos: Todo[],
    fields: string[],
  ): string {
    if (todos.length === 0) {
      return "No todos found";
    }

    const body = todos
      .map((todo) => {
        if (fields === undefined) {
          return todo;
        }

        const row = fields.map((field) => {
          if (!(field in todo)) {
            throw new Error(`Unknown field "${field}"`);
          }

          return formatter(
            field as keyof Todo,
            fieldToString(field as keyof Todo, todo[field as keyof Todo]),
            field === "title" ? "end" : "start",
          );
        });

        return `| ${row.join(` ${SEPERATOR} `)} |`;
      }).join("\n");

    const headers = fields.map((field) => {
      return formatter(field as keyof Todo, field, "end");
    });
    const header = `| ${headers.join(` ${SEPERATOR} `)} |`;
    const line = fields.map((field) => {
      return "-".repeat(FIELD_LENGTHS[field as keyof Todo] + 2);
    }).join("+");

    return `${header}\n+${line}+\n${body}`;
  };
}
