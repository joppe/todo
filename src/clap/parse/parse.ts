import type { Command } from "../command.ts";
import { EXPORT_PROPERTY } from "../config.ts";
import { input } from "../input.ts";
import { parseCommand, Result } from "./parseCommand.ts";
import { validateCommand } from "./validateCommand.ts";

export function parse<T extends Result>(command: Command, args: string[]): T {
  const data = command[EXPORT_PROPERTY];
  const output = parseCommand(data, input(args));

  validateCommand(data, output);

  return output as T;
}
