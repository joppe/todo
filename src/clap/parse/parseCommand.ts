import type { CommandData } from "@clap/command.ts";
import { findSubcommand } from "@clap/parse/findSubcommand.ts";
import type { Input } from "@clap/input.ts";
import { findArg } from "@clap/parse/findArg.ts";

export type ResultValue = string | string[] | boolean;
export type Result = {
  [key: string]: ResultValue | Result;
};

export function parseCommand(command: CommandData, inputArgs: Input[]): Result {
  const positionalArgs = command.args.filter((arg) => arg.positional);
  let positionalIndex = 0;

  const output: Result = {};

  for (let index = 0; index < inputArgs.length; index++) {
    const inputArg = inputArgs[index] as Input;

    if (inputArg.type === "anonymous") {
      const subcommand = findSubcommand(command, inputArg);

      if (subcommand) {
        const subcommandArgs = parseCommand(
          subcommand,
          inputArgs.slice(index + 1),
        );

        output[subcommand.name] = subcommandArgs;
        index += inputArgs.length - 1 - index;

        continue;
      }

      const positionalArg = positionalArgs[positionalIndex];

      if (!positionalArg) {
        throw new Error(`Positional argument not found for ${inputArg.value}`);
      }

      if (positionalArg.multiple) {
        if (!output[positionalArg.name]) {
          output[positionalArg.name] = [];
        }

        (output[positionalArg.name] as string[]).push(inputArg.value);

        const rest = inputArgs.length - 1 - index;

        if (rest <= positionalArgs.length - 1 - positionalIndex) {
          positionalIndex += 1;
        }
      } else {
        output[positionalArg.name] = inputArg.value;
        positionalIndex += 1;
      }
    } else {
      const foundArg = findArg(command, inputArg);

      if (!foundArg) {
        throw new Error(`Argument ${inputArg.value} not found`);
      }

      if (foundArg.flag) {
        output[foundArg.name] = true;
      } else {
        const next = inputArgs[index + 1];

        if (!next || next.type !== "anonymous") {
          throw new Error(`Argument ${inputArg.value} requires a value`);
        }

        output[foundArg.name] = next.value;
        index += 1;
      }
    }
  }

  return output;
}
