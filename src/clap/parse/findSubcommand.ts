import type { CommandData } from "@clap/command.ts";
import type { Input } from "@clap/input.ts";

export function findSubcommand(
  command: CommandData,
  inputArg: Input,
): CommandData | undefined {
  return command.commands.find((arg) => arg.name === inputArg.value);
}
