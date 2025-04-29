import type { Command } from "@clap/command.ts";
import { EXPORT_PROPERTY } from "@clap/config.ts";
import { input } from "@clap/input.ts";
import { parseCommand, Result } from "@clap/parse/parseCommand.ts";
import { validateCommand } from "@clap/parse/validateCommand.ts";

export function parse<T extends Result>(command: Command, args: string[]): T {
  const data = command[EXPORT_PROPERTY];
  const output = parseCommand(data, input(args));

  validateCommand(data, output);

  return output as T;
}
