import type { RawArgument } from './argument.ts';
import type { Command, RawCommand } from './command.ts';

type InputArgType = 'long' | 'short' | 'anonymous';
type InputArg = {
	value: string;
	type: InputArgType;
};

function inputArgs(args: string[]): InputArg[] {
	return args.reduce((acc: InputArg[], arg: string): InputArg[] => {
		if (arg.startsWith('--')) {
			acc.push({
				value: arg.slice(2),
				type: 'long',
			});
		} else if (arg.startsWith('-')) {
			arg
				.slice(1)
				.split('')
				.forEach((value) => {
					acc.push({
						value,
						type: 'short',
					});
				});
		} else {
			acc.push({
				value: arg,
				type: 'anonymous',
			});
		}
		return acc;
	}, []);
}

function findArg(
	command: RawCommand,
	inputArg: InputArg,
): RawArgument | undefined {
	return command.args.find((arg) => {
		if (inputArg.type === 'long') {
			return arg.name === inputArg.value;
		} else if (inputArg.type === 'short') {
			return arg.short === inputArg.value;
		}

		return false;
	});
}

function parseCommand(
	command: RawCommand,
	inputArgs: InputArg[],
): Record<string, any> {
	const positionalArgs = command.args.filter((arg) => arg.positional);
	let positionalIndex = 0;

	const output: Record<string, any> = {};

	for (let index = 0; index < inputArgs.length; index++) {
		const inputArg = inputArgs[index] as InputArg;

		if (inputArg.type === 'anonymous') {
			const positionalArg = positionalArgs[positionalIndex];

			if (!positionalArg) {
				throw new Error(`Positional argument not found for ${inputArg.value}`);
			}

			if (positionalArg.multiple) {
				if (!output[positionalArg.name]) {
					output[positionalArg.name] = [];
				}

				output[positionalArg.name].push(inputArg.value);

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

				if (!next || next.type !== 'anonymous') {
					throw new Error(`Argument ${inputArg.value} requires a value`);
				}

				output[foundArg.name] = next.value;
				index += 1;
			}
		}
	}

	return output;
}

export function parse(
	command: Command,
	args: string[],
): Record<string, string | string[] | boolean> {
	const raw = command.raw();
	const output = parseCommand(raw, inputArgs(args));

	return output;
}
