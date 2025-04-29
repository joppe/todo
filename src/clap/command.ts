import type { Argument, ArgumentData } from "./argument.ts";
import { EXPORT_PROPERTY } from "@clap/config.ts";

export type CommandData = {
  name: string;
  description: string;
  args: Array<ArgumentData>;
  commands: Array<CommandData>;
  requireSubcommand: boolean;
};

export class Command {
  protected _name: string;
  protected _description: string = "";
  protected _args: Argument[];
  protected _subcommands: Command[];
  protected _requireSubcommand: boolean = false;

  get [EXPORT_PROPERTY](): CommandData {
    return {
      name: this._name,
      description: this._description,
      args: this._args.map((arg) => arg[EXPORT_PROPERTY]),
      commands: this._subcommands.map((cmd) => cmd[EXPORT_PROPERTY]),
      requireSubcommand: this._requireSubcommand,
    };
  }

  public constructor(name: string) {
    this._name = name;
    this._args = [];
    this._subcommands = [];
  }

  public description(description: string): Command {
    this._description = description;

    return this;
  }

  public arg(arg: Argument): Command {
    this._args.push(arg);

    return this;
  }

  public subcommand(subcommand: Command): Command {
    this._subcommands.push(subcommand);

    return this;
  }

  public requireSubcommand(): Command {
    this._requireSubcommand = true;

    return this;
  }
}

export function command(name: string): Command {
  return new Command(name);
}
