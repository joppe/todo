import { Command } from "@cliffy/command";
import type { TodoRepository } from "../../domain/repository.ts";

// Use cases
import { createAddTodoUseCase } from "../../application/usecases/addTodo.ts";
import { createListTodosUseCase } from "../../application/usecases/listTodos.ts";
import { createCompleteTodoUseCase } from "../../application/usecases/completeTodo.ts";
import { createDeleteTodoUseCase } from "../../application/usecases/deleteTodo.ts";
import { createSearchTodosUseCase } from "../../application/usecases/searchTodos.ts";
import { createGetTodoByIdUseCase } from "../../application/usecases/getTodoById.ts";
import { createListTagsUseCase } from "../../application/usecases/listTags.ts";
import { createRenameTagUseCase } from "../../application/usecases/renameTag.ts";
import { createDeleteTagUseCase } from "../../application/usecases/deleteTag.ts";

// Command handlers
import { createAddCommand } from "../../presentation/commands/addCommand.ts";
import { createListCommand } from "../../presentation/commands/listCommand.ts";
import { createCompleteCommand } from "../../presentation/commands/completeCommand.ts";
import { createDeleteCommand } from "../../presentation/commands/deleteCommand.ts";
import { createSearchCommand } from "../../presentation/commands/searchCommand.ts";
import { createShowCommand } from "../../presentation/commands/showCommand.ts";
import {
  createTagsListCommand,
  createTagsRenameCommand,
  createTagsDeleteCommand,
} from "../../presentation/commands/tagsCommand.ts";

/**
 * Creates the CLI application with all commands wired up.
 * 
 * @param repository - TodoRepository for data access
 * @returns Configured Cliffy Command instance
 */
export function createCli(repository: TodoRepository): Command {
  // Initialize use cases
  const addTodo = createAddTodoUseCase(repository);
  const listTodos = createListTodosUseCase(repository);
  const completeTodo = createCompleteTodoUseCase(repository);
  const deleteTodo = createDeleteTodoUseCase(repository);
  const searchTodos = createSearchTodosUseCase(repository);
  const getTodoById = createGetTodoByIdUseCase(repository);
  const listTags = createListTagsUseCase(repository);
  const renameTag = createRenameTagUseCase(repository);
  const deleteTag = createDeleteTagUseCase(repository);

  // Initialize command handlers
  const addCommand = createAddCommand(addTodo);
  const listCommand = createListCommand(listTodos);
  const completeCommand = createCompleteCommand(completeTodo);
  const deleteCommand = createDeleteCommand(deleteTodo);
  const searchCommand = createSearchCommand(searchTodos);
  const showCommand = createShowCommand(getTodoById);
  const tagsListCommand = createTagsListCommand(listTags);
  const tagsRenameCommand = createTagsRenameCommand(renameTag);
  const tagsDeleteCommand = createTagsDeleteCommand(deleteTag);

  // Build CLI
  const cli = new Command()
    .name("todo")
    .version("1.0.0")
    .description("A clean, functional CLI for managing todos")
    .action(function () {
      this.showHelp();
    });

  // Add command
  cli.command("add <title:string>")
    .description("Add a new todo")
    .option("-d, --description <description:string>", "Todo description")
    .option("-p, --priority <priority:string>", "Priority level (high, medium, low)", {
      default: "medium",
    })
    .option("-c, --category <category:string>", "Category")
    .option("--due <date:string>", "Due date (e.g., today, tomorrow, 2026-12-31)")
    .option("-t, --tags <tags:string>", "Comma-separated tags")
    .action(addCommand);

  // List command
  cli.command("list")
    .alias("ls")
    .description("List all todos")
    .option("-s, --status <status:string>", "Filter by status (pending, completed, cancelled)")
    .option("-p, --priority <priority:string>", "Filter by priority (high, medium, low)")
    .option("-c, --category <category:string>", "Filter by category")
    .option("-t, --tag <tag:string>", "Filter by tag")
    .option("--overdue", "Show only overdue todos")
    .action(listCommand);

  // Complete command
  cli.command("complete <id:string>")
    .alias("done")
    .description("Mark a todo as completed")
    .action(completeCommand);

  // Delete command
  cli.command("delete <id:string>")
    .alias("rm")
    .description("Delete a todo")
    .action(deleteCommand);

  // Search command
  cli.command("search <query:string>")
    .alias("find")
    .description("Search todos by text")
    .option("-s, --status <status:string>", "Filter by status")
    .option("-p, --priority <priority:string>", "Filter by priority")
    .option("-c, --category <category:string>", "Filter by category")
    .option("-t, --tag <tag:string>", "Filter by tag")
    .option("--overdue", "Show only overdue todos")
    .action(searchCommand);

  // Show command
  cli.command("show <id:string>")
    .description("Show detailed information about a todo")
    .action(showCommand);

  // Tags command (with subcommands)
  const tagsCmd = new Command()
    .description("Manage tags")
    .action(tagsListCommand);

  tagsCmd.command("list")
    .description("List all tags with counts")
    .action(tagsListCommand);

  tagsCmd.command("rename <old-name:string> <new-name:string>")
    .description("Rename a tag globally")
    .action(tagsRenameCommand);

  tagsCmd.command("delete <name:string>")
    .alias("rm")
    .description("Delete a tag")
    .action(tagsDeleteCommand);

  cli.command("tags", tagsCmd);

  return cli;
}
