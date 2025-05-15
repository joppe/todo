import { assertEquals, assertThrows } from "jsr:@std/assert";

import * as clap from "./clap.ts";

Deno.test("clap", async (t) => {
  await t.step("long", () => {
    type Copy = {
      recursive?: boolean;
      source: string[];
      target: string;
    };

    const cp = clap
      .command("cp")
      .description("copy files and directories")
      .arg(
        clap
          .argument("recursive")
          .short("r")
          .description("copy directories recursively")
          .flag(),
      )
      .arg(
        clap
          .argument("source")
          .description("source file or directory")
          .required()
          .multiple()
          .positional(),
      )
      .arg(
        clap
          .argument("target")
          .description("target file or directory")
          .required()
          .positional(),
      );

    const args = clap.parse<Copy>(cp, ["--recursive", "foo", "bar", "quux"]);

    assertEquals(args.recursive, true);
    assertEquals(args.source, ["foo", "bar"]);
    assertEquals(args.target, "quux");
  });

  await t.step("short", () => {
    type Copy = {
      recursive?: boolean;
      source: string[];
      target: string;
    };

    const cp = clap
      .command("cp")
      .description("copy files and directories")
      .arg(
        clap
          .argument("recursive")
          .short("r")
          .description("copy directories recursively")
          .flag(),
      )
      .arg(
        clap
          .argument("source")
          .description("source file or directory")
          .required()
          .multiple()
          .positional(),
      )
      .arg(
        clap
          .argument("target")
          .description("target file or directory")
          .required()
          .positional(),
      );

    const args = clap.parse<Copy>(cp, ["-r", "foo", "bar", "quux"]);

    assertEquals(args.recursive, true);
    assertEquals(args.source, ["foo", "bar"]);
    assertEquals(args.target, "quux");
  });

  await t.step("expand short", () => {
    type List = {
      long?: boolean;
      all?: boolean;
      target: string;
    };

    const ls = clap
      .command("ls")
      .description("list files and directories")
      .arg(
        clap
          .argument("long")
          .short("l")
          .description("use a long listing format")
          .flag(),
      )
      .arg(
        clap
          .argument("all")
          .short("a")
          .description("do not ignore entries starting with .")
          .flag(),
      )
      .arg(
        clap
          .argument("target")
          .description("target file or directory")
          .positional(),
      );

    const args = clap.parse<List>(ls, ["-la", "."]);

    assertEquals(args.long, true);
    assertEquals(args.all, true);
    assertEquals(args.target, ".");
  });

  await t.step("value", () => {
    type Server = {
      port?: string;
    };

    const server = clap
      .command("http-server")
      .arg(clap.argument("port").short("p").description("port to listen on"));

    const args = clap.parse<Server>(server, ["-p", "8080"]);

    assertEquals(args.port, "8080");
  });

  await t.step("subcommand", () => {
    type Todo = {
      add?: {
        title: string;
        priority?: string;
      };
    };

    const todo = clap
      .command("todo")
      .subcommand(
        clap
          .command("add")
          .description("add a new todo")
          .arg(
            clap
              .argument("title")
              .description("title of the todo")
              .required()
              .positional(),
          )
          .arg(
            clap
              .argument("priority")
              .description("priority of the todo")
              .short("p"),
          ),
      );

    const args = clap.parse<Todo>(todo, ["add", "-p", "1", "buy milk"]);

    assertEquals(args.add?.title, "buy milk");
    assertEquals(args.add?.priority, "1");
  });

  await t.step("multiple subcommands", () => {
    type Todo = {
      add?: {
        title: string;
        priority?: string;
      };
      list?: {
        sort?: string;
        direction?: string;
        filterDone?: true;
      };
    };

    const todo = clap
      .command("todo")
      .subcommand(
        clap
          .command("add")
          .description("add a new todo")
          .arg(
            clap
              .argument("title")
              .description("title of the todo")
              .required()
              .positional(),
          )
          .arg(
            clap
              .argument("priority")
              .description("priority of the todo")
              .short("p"),
          ),
      )
      .subcommand(
        clap
          .command("list")
          .description("list all todos")
          .arg(clap.argument("sort").short("s").description("sort by field"))
          .arg(clap.argument("direction").short("d").description("sort order"))
          .arg(
            clap
              .argument("filterDone")
              .short("f")
              .description("filter done")
              .flag(),
          ),
      );

    const args = clap.parse<Todo>(todo, [
      "list",
      "-s",
      "title",
      "--direction",
      "asc",
      "-f",
    ]);

    assertEquals(args.list?.sort, "title");
    assertEquals(args.list?.direction, "asc");
    assertEquals(args.list?.filterDone, true);
  });

  await t.step("required argument", () => {
    type List = {
      target: string;
    };

    const ls = clap
      .command("ls")
      .arg(
        clap
          .argument("target")
          .positional().required(),
      );

    assertThrows(
      () => {
        clap.parse<List>(ls, []);
      },
      Error,
      "Argument 'target' is required",
    );
  });

  await t.step("required argument", () => {
    type Todo = {
      add?: {
        title: string;
        priority?: string;
      };
      list?: {
        sort?: string;
        direction?: string;
        filterDone?: true;
      };
    };

    const todo = clap
      .command("todo")
      .requireSubcommand()
      .subcommand(
        clap
          .command("add")
          .description("add a new todo")
          .arg(
            clap
              .argument("title")
              .description("title of the todo")
              .required()
              .positional(),
          )
          .arg(
            clap
              .argument("priority")
              .description("priority of the todo")
              .short("p"),
          ),
      )
      .subcommand(
        clap
          .command("list")
          .description("list all todos")
          .arg(clap.argument("sort").short("s").description("sort by field"))
          .arg(clap.argument("direction").short("d").description("sort order"))
          .arg(
            clap
              .argument("filterDone")
              .short("f")
              .description("filter done")
              .flag(),
          ),
      );

    assertThrows(
      () => {
        clap.parse<Todo>(todo, []);
      },
      Error,
      "Command 'todo' requires subcommand",
    );
  });
});
