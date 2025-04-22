import { describe, expect, test } from 'vitest';

import { clap, explode } from './clap.ts';

describe('clap', () => {
	test('explode', () => {
		expect(explode(['-abc', '--def', 'ghi'])).toEqual([
			'-a',
			'-b',
			'-c',
			'--def',
			'ghi',
		]);
	});

	test('parse', () => {
		const program = clap(
			'ls',
			{
				description: 'list directory contents',
			},
			(git) => {
				git
					.arg('all', {
						flag: true,
						short: 'a',
						description: 'do not ignore entries starting with .',
					})
					.arg('long', {
						flag: true,
						short: 'l',
						description: 'use a long listing format',
					})
					.arg('block-size', {
						description:
							"with  -l,  scale  sizes  by   SIZE   when   printing   them;   e.g., '--block-size=M'; see SIZE format below",
					})
					.arg('files', {
						positional: true,
						default: '.',
						multiple: true,
					});
			},
		);

		expect(program.parse(['-al', '--block-size', 'M'])).not.toBeUndefined();
		/*/
		expect(program.parse(['-al', '--block-size', 'M'])).toBe([
			{ name: 'all' },
			{ name: 'long' },
			{ name: 'block-size', value: 'M' },
			{ name: 'files', value: ['.'] },
		]);
    /**/
	});

	test('debug', () => {
		const program = clap(
			'git',
			{
				description: 'the stupid content tracker',
			},
			(git) => {
				git
					.arg('config', {
						short: 'c',
					})
					.subcommand(
						'commit',
						{
							description: 'Record changes to the repository',
						},
						(commit) => {
							commit.arg('ammend', {
								flag: true,
							});
						},
					);
			},
		);

		expect(program.debug()).toEqual({
			name: 'git',
			description: 'the stupid content tracker',
			args: [
				{
					name: 'config',
					description: undefined,
					required: false,
					type: 'argument',
					short: 'c',
					long: 'config',
					default: undefined,
					conflicts: [],
					multiple: false,
				},
			],
			subcommands: [
				{
					name: 'commit',
					description: 'Record changes to the repository',
					args: [
						{
							name: 'ammend',
							description: undefined,
							required: false,
							type: 'flag',
							short: undefined,
							long: 'ammend',
							default: undefined,
							conflicts: [],
							multiple: false,
						},
					],
					subcommands: [],
				},
			],
		});
	});
});
