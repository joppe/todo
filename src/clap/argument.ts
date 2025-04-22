import type { OneOf } from '../types/OneOf.ts';

export type ArgOptions = OneOf<[Flag, Argument, Positional]>;

export type ArgBaseOptions = {
	description?: string;
	required?: boolean;
	conflicts?: string[];
};

export type Flag = ArgBaseOptions & {
	short?: string;
	long?: string;
	flag: true;
};

export type Argument = ArgBaseOptions & {
	short?: string;
	long?: string;
	default?: string;
	multiple?: boolean;
	validate?: Validator;
};

export type Positional = ArgBaseOptions & {
	positional: true;
	default?: string;
	multiple?: boolean;
	validate?: Validator;
};

export type Validator = (value: string) => boolean;

export type ArgType = 'flag' | 'argument' | 'positional';

export type Arg = {
	name: string;
	description?: string;
	required: boolean;
	type: ArgType;
	short?: string;
	long: string;
	default?: string;
	conflicts: string[];
	multiple: boolean;
	validate: Validator;
};

export function argument(name: string, options: ArgOptions): Arg {
	return {
		name,
		description: options.description,
		required: options.required ?? false,
		type: options.flag ? 'flag' : 'argument',
		short: options.short,
		long: options.long ?? name,
		default: options.default,
		conflicts: options.conflicts ?? [],
		multiple: options.multiple ?? false,
		validate: options.validate ?? (() => true),
	};
}
