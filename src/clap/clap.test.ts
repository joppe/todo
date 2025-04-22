import { describe, expect, test } from 'vitest';
import * as clap from './clap.ts';

describe('clap', () => {
	test('long', () => {
		const cp = clap
			.command('cp')
			.description('copy files and directories')
			.arg(
				clap
					.argument('recursive')
					.short('r')
					.description('copy directories recursively')
					.flag(),
			)
			.arg(
				clap
					.argument('source')
					.description('source file or directory')
					.required()
					.multiple()
					.positional(),
			)
			.arg(
				clap
					.argument('target')
					.description('target file or directory')
					.required()
					.positional(),
			);

		const args = clap.parse(cp, ['--recursive', 'foo', 'bar', 'quux']);

		expect(args.recursive).toBe(true);
		expect(args.source).toEqual(['foo', 'bar']);
		expect(args.target).toBe('quux');
	});

	test('short', () => {
		const cp = clap
			.command('cp')
			.description('copy files and directories')
			.arg(
				clap
					.argument('recursive')
					.short('r')
					.description('copy directories recursively')
					.flag(),
			)
			.arg(
				clap
					.argument('source')
					.description('source file or directory')
					.required()
					.multiple()
					.positional(),
			)
			.arg(
				clap
					.argument('target')
					.description('target file or directory')
					.required()
					.positional(),
			);

		const args = clap.parse(cp, ['-r', 'foo', 'bar', 'quux']);

		expect(args.recursive).toBe(true);
		expect(args.source).toEqual(['foo', 'bar']);
		expect(args.target).toBe('quux');
	});

	test('expand short', () => {
		const ls = clap
			.command('ls')
			.description('list files and directories')
			.arg(
				clap
					.argument('long')
					.short('l')
					.description('use a long listing format')
					.flag(),
			)
			.arg(
				clap
					.argument('all')
					.short('a')
					.description('do not ignore entries starting with .')
					.flag(),
			)
			.arg(
				clap
					.argument('target')
					.description('target file or directory')
					.positional(),
			);

		const args = clap.parse(ls, ['-la', '.']);

		expect(args.long).toBe(true);
		expect(args.all).toBe(true);
		expect(args.target).toEqual('.');
	});

	test('value', () => {
		const server = clap
			.command('http-server')
			.arg(clap.argument('port').short('p').description('port to listen on'));

		const args = clap.parse(server, ['-p', '8080']);

		expect(args.port).toEqual('8080');
	});
});
