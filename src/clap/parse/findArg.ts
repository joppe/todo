import type { CommandData } from "../command.ts";
import type { Input } from "../input.ts";
import type { ArgumentData } from "../argument.ts";

export function findArg(
  command: CommandData,
  inputArg: Input,
): ArgumentData | undefined {
  return command.args.find((arg) => {
    if (inputArg.type === "long") {
      return arg.name === inputArg.value;
    } else if (inputArg.type === "short") {
      return arg.short === inputArg.value;
    }

    return false;
  });
}
