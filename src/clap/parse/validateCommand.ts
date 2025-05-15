import type { CommandData } from "../command.ts";
import type { Result } from "./parseCommand.ts";

export function validateCommand(command: CommandData, result: Result): void {
  command.args.map((arg) => {
    if (arg.required && result[arg.name] === undefined) {
      throw new Error(`Argument '${arg.name}' is required`);
    }
  });

  let hasSubcommand = false;

  command.commands.map((subcommand) => {
    if (result[subcommand.name]) {
      hasSubcommand = true;
      validateCommand(subcommand, result[subcommand.name] as Result);
    }
  });

  if (command.requireSubcommand && !hasSubcommand) {
    throw new Error(`Command '${command.name}' requires subcommand`);
  }
}
