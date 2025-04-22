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

	test('subcommand', () => {
		type Todo = {
			add: {
				title: string;
				priority?: string;
			};
		};

		const todo = clap
			.command('todo')
			.subcommand(
				clap
					.command('add')
					.description('add a new todo')
					.arg(
						clap
							.argument('title')
							.description('title of the todo')
							.required()
							.positional(),
					)
					.arg(
						clap
							.argument('priority')
							.description('priority of the todo')
							.short('p'),
					),
			);

		const args = clap.parse<Todo>(todo, ['add', '-p', '1', 'buy milk']);

		expect(args.add.title).toEqual('buy milk');
		expect(args.add.priority).toEqual('1');
	});

	test('multiple subcommands', () => {
		type Todo = {
			add: {
				title: string;
				priority?: string;
			};
			list: {
				sort?: string;
				direction?: string;
				filterDone?: true;
			};
		};

		const todo = clap
			.command('todo')
			.subcommand(
				clap
					.command('add')
					.description('add a new todo')
					.arg(
						clap
							.argument('title')
							.description('title of the todo')
							.required()
							.positional(),
					)
					.arg(
						clap
							.argument('priority')
							.description('priority of the todo')
							.short('p'),
					),
			)
			.subcommand(
				clap
					.command('list')
					.description('list all todos')
					.arg(clap.argument('sort').short('s').description('sort by field'))
					.arg(clap.argument('direction').short('d').description('sort order'))
					.arg(
						clap
							.argument('filterDone')
							.short('f')
							.description('filter done')
							.flag(),
					),
			);

		const args = clap.parse<Todo>(todo, [
			'list',
			'-s',
			'title',
			'--direction',
			'asc',
			'-f',
		]);

		expect(args.list.sort).toEqual('title');
		expect(args.list.direction).toEqual('asc');
		expect(args.list.filterDone).toEqual(true);
	});
});
