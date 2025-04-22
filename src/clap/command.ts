import { type Arg, type ArgOptions, argument } from './argument.ts';

export type CommandOptions = {
	description?: string;
	subcommandRequired?: boolean;
};

export type CommandDebug = {
	name: string;
	description: string | undefined;
	args: Omit<Arg, 'validate'>[];
	subcommands: CommandDebug[];
};

export type Command = {
	name: string;
	description?: string;
	version?: string;
	about?: string;
	subcommandRequired: boolean;
	args: Arg[];
	subcommands: Command[];
	arg(name: string, options: ArgOptions): Command;
	subcommand(
		name: string,
		options: CommandOptions,
		cb?: (cmd: Command) => void,
	): Command;
	debug(): CommandDebug;
};

export function command(name: string, options: CommandOptions): Command {
	const args: Arg[] = [];
	const subcommands: Command[] = [];

	return {
		get name(): string {
			return name;
		},

		get description(): string | undefined {
			return options.description;
		},

		get subcommandRequired(): boolean {
			return options.subcommandRequired === true;
		},

		get args(): Arg[] {
			return args;
		},

		get subcommands(): Command[] {
			return subcommands;
		},

		debug(): CommandDebug {
			return {
				name,
				description: options.description,
				args: args.map((arg) => {
					const { validate: _, ...rest } = arg;

					return rest;
				}),
				subcommands: subcommands.map((subcommand) => subcommand.debug()),
			};
		},

		arg(name: string, options: ArgOptions): Command {
			args.push(argument(name, options));

			return this;
		},

		subcommand(
			name: string,
			options: CommandOptions,
			cb?: (cmd: Command) => void,
		): Command {
			const cmd = command(name, options);

			cb?.(cmd);
			subcommands.push(cmd);

			return this;
		},
	};
}
