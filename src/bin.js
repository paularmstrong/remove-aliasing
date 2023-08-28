#!/usr/bin/env node

const { program } = require('commander');
const { run: jscodeshift } = require('jscodeshift/src/Runner');
const path = require('node:path');
const { version } = require('../package.json');

program
	.name('remove-aliasing')
	.description('Rewrites imports to remove module aliasing')
	.argument('<directory>', 'Directory to parse and rewrite')
	.requiredOption('-r, --root <value>', 'Directory that serves as the root of aliased files')
	.option('-p, --prefix <value>', 'Import path prefix', '')
	.option('--parser <value>', 'jscodeshift code parser', 'tsx')
	.option('--dry, --dry-run', 'Do not actually write, just see what will happen')
	.option('-v, --verbosity <number>', 'Show more information about the transform process', parseInt, 0)
	.version(version);

program.parse();

const argv = program.opts();
if (argv.verbosity > 1) {
	console.log('remove-aliasing version:', version);
	console.table(argv);
}

const paths = [path.join(process.cwd(), program.args[0])];

const transformPath = require.resolve('./transformer.js');
const options = {
	dry: !!argv.dryRun,
	print: true,
	root: path.join(process.cwd(), argv.root),
	prefix: argv.prefix,
	parser: argv.parser,
	print: false,
	verbose: argv.verbosity,
};

if (argv.verbosity > 0) {
	console.table(options);
}

async function run() {
	const res = await jscodeshift(transformPath, paths, options);
	console.table(res);
}

run();
