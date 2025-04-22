/**
 * Command (name, description, version, about)
 * Subcommand (name, description)
 * Arg (short, long, flag, default, help, array/multiple, boolean, check/validate, choices/options)
 */
import { clap } from './clap/clap.ts';

const cli = clap();

cli.command('hello').version('1.0.0').about('Hello world');
cli.parse(['hello', '--version']);
