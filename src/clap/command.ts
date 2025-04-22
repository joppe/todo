import type { Argument, RawArgument } from './argument.ts';

export type RawCommand = {
	name: string;
	description: string;
	args: Array<RawArgument>;
};

export class Command {
	protected _name: string;
	protected _description: string = '';
	protected _args: Argument[];

	public constructor(name: string) {
		this._name = name;
		this._args = [];
	}

	public description(description: string): Command {
		this._description = description;

		return this;
	}

	public arg(arg: Argument): Command {
		this._args.push(arg);

		return this;
	}

	public raw(): RawCommand {
		return {
			name: this._name,
			description: this._description,
			args: this._args.map((arg) => arg.raw()),
		};
	}
}

export function command(name: string): Command {
	return new Command(name);
}
