import type { Arg } from './argument.ts';
import { type Command, type CommandDebug, command } from './command.ts';

export type ParseResult = {
	name: string;
	value?: string | string[];
};

export type ClapOptions = {
	description?: string;
	subcommandRequired?: boolean;
	version?: string;
	about?: string;
};

export type Clap = {
	debug(): CommandDebug;
	parse(args: string[]): ParseResult[];
};

export function isLongArg(arg: string): boolean {
	return arg.startsWith('--');
}

export function isShortArg(arg: string): boolean {
	return arg.startsWith('-') && !isLongArg(arg);
}

export function explode(args: string[]): string[] {
	return args.reduce((acc: string[], arg: string) => {
		if (isShortArg(arg)) {
			acc.push(
				...arg
					.slice(1)
					.split('')
					.map((flag) => `-${flag}`),
			);
		} else {
			acc.push(arg);
		}

		return acc;
	}, []);
}

export function findSubcommand(
	cmd: Command,
	name: string,
): Command | undefined {
	return cmd.subcommands.find((sub) => sub.name === name);
}

export function findPositional(cmd: Command, index: number): Arg | undefined {
	return cmd.args
		.filter((arg: Arg) => arg.type === 'positional')
		.find((_: Arg, i: number) => i === index);
}

export function findArg(
	cmd: Command,
	arg: string,
	positionals: number,
): Arg | undefined {
	if (isShortArg(arg)) {
		const short = arg.slice(1);

		return cmd.args.find((a) => a.short === short);
	}

	if (isLongArg(arg)) {
		const long = arg.slice(2);

		return cmd.args.find((a) => a.long === long);
	}

	if (findSubcommand(cmd, arg) !== undefined) {
		return undefined;
	}

	return findPositional(cmd, positionals);
}

export function parse(cmd: Command, args: string[]): ParseResult[] {
	const result: ParseResult[] = [];
	let positionals = 0;

	for (let index = 0; index < args.length; index += 1) {
		const arg = findArg(cmd, args[index] as string, positionals);

		if (arg === undefined) {
			const subcommand = findSubcommand(cmd, args[index] as string);

			if (subcommand === undefined) {
				throw new Error(`Unknown argument: ${args[index]}`);
			}

			result.push(
				{
					name: subcommand.name,
				},
				...parse(subcommand, args.slice(index + 1)),
			);

			return result;
		}

		if (arg.type === 'positional') {
			positionals += 1;
		}

		if (arg.type === 'flag') {
			result.push({
				name: arg.name,
			});

			continue;
		}

		const values = [];

		if (arg.multiple) {
			while (+index < args.length) {
				const value = args[index] as string;

				if (isShortArg(value) || isLongArg(value)) {
					break;
				}

				values.push(value);
			}
		} else {
			values.push(args[++index] as string);
		}

		result.push({
			name: arg.name,
			value: arg.multiple ? values : values[0],
		});
	}

	// apply default values

	return result;
}

export const ARGUMENT_DELIMITER = '--';

export function clap(
	name: string,
	options: ClapOptions,
	cb?: (cmd: Command) => void,
): Clap {
	const cmd = command(name, {
		description: options.description,
		subcommandRequired: options.subcommandRequired,
	});

	cb?.(cmd);

	return {
		debug(): CommandDebug {
			return cmd.debug();
		},

		parse(args: string[]): ParseResult[] {
			const exploded = explode(args);

			console.log(parse(cmd, exploded));
			return parse(cmd, exploded);
		},
	};
}
