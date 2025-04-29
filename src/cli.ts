import * as clap from "@clap/clap.ts";
import { createTodo, listTodos } from "./modules/todo/use-cases/index.ts";

type Todo = {
  add?: {
    title: string;
    description?: string;
    deadline?: string;
  };
  list?: {
    sort?: string;
    direction?: string;
  };
};

const todo = clap.command("todo").description("Commands for managing todos")
  .subcommand(
    clap.command("add").arg(
      clap
        .argument("title")
        .description("The title of the todo")
        .required(),
    )
      .arg(
        clap
          .argument("description")
          .description("The description of the todo"),
      )
      .arg(
        clap
          .argument("deadline")
          .description("The deadline of the todo"),
      ),
  )
  .subcommand(
    clap.command("list").arg(
      clap
        .argument("sort")
        .description("Sort the list of todos"),
    ).arg(
      clap
        .argument("direction")
        .description("The direction to sort the list of todos"),
    ),
  );

const args = clap.parse<Todo>(todo, Deno.args);

if (args.add) {
  const { title, description, deadline } = args.add;

  await createTodo({ title, description, deadline });
} else if (args.list) {
  const list = await listTodos();

  console.table(list, ["id", "title", "description", "done", "deadline"]);
}
