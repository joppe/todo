export type InputType = "long" | "short" | "anonymous";
export type Input = {
  value: string;
  type: InputType;
};

export function input(args: string[]): Input[] {
  return args.reduce((acc: Input[], arg: string): Input[] => {
    if (arg.startsWith("--")) {
      acc.push({
        value: arg.slice(2),
        type: "long",
      });
    } else if (arg.startsWith("-")) {
      arg
        .slice(1)
        .split("")
        .forEach((value) => {
          acc.push({
            value,
            type: "short",
          });
        });
    } else {
      acc.push({
        value: arg,
        type: "anonymous",
      });
    }
    return acc;
  }, []);
}
