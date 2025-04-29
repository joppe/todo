import { EXPORT_PROPERTY } from "@clap/config.ts";

export type ArgumentData = {
  name: string;
  description: string;
  short?: string;
  required: boolean;
  flag: boolean;
  multiple: boolean;
  positional: boolean;
};

export class Argument {
  protected _name: string;
  protected _description: string = "";
  protected _short: string | undefined = undefined;
  protected _required: boolean = false;
  protected _flag: boolean = false;
  protected _multiple: boolean = false;
  protected _positional: boolean = false;

  get [EXPORT_PROPERTY](): ArgumentData {
    return {
      name: this._name,
      description: this._description,
      short: this._short,
      required: this._required,
      flag: this._flag,
      multiple: this._multiple,
      positional: this._positional,
    };
  }

  public constructor(name: string) {
    this._name = name;
  }

  public description(description: string): Argument {
    this._description = description;

    return this;
  }

  public short(short: string): Argument {
    this._short = short;

    return this;
  }

  public required(): Argument {
    this._required = true;

    return this;
  }

  public flag(): Argument {
    this._flag = true;

    return this;
  }

  public multiple(): Argument {
    this._multiple = true;

    return this;
  }

  public positional(): Argument {
    this._positional = true;

    return this;
  }
}

export function argument(name: string): Argument {
  return new Argument(name);
}
