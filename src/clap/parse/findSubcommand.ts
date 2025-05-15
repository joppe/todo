import type { CommandData } from "../command.ts";
import type { Input } from "../input.ts";

export function findSubcommand(
  command: CommandData,
  inputArg: Input,
): CommandData | undefined {
  return command.commands.find((arg) => arg.name === inputArg.value);
}
