const { program } = require('commander');
const { run: jscodeshift } = require('jscodeshift/src/Runner');
const path = require('node:path');

program
	.name('remove-aliasing')
	.description('Rewrites imports to remove module aliasing')
	.argument('<directory>', 'Directory to parse and rewrite')
	.option('--dry-run', 'Do not actually write, just see what will happen')
	.requiredOption('-r, --root <dir>', 'Directory that serves as the root of aliased files')
	.option('-p, --prefix <prefix>', 'Import path prefix', '')
	.option('--parser <parser>', 'jscodeshift code parser', 'tsx');

program.parse();

const argv = program.opts();

const paths = [path.join(process.cwd(), program.args[0])];

const transformPath = require.resolve('./index.js');
console.log(transformPath);
const options = {
	dry: !!argv.dryRun,
	print: true,
	root: path.join(process.cwd(), argv.root),
	prefix: argv.prefix,
	parser: argv.parser,
	print: false,
};

console.log(options);

async function run() {
	const res = await jscodeshift(transformPath, paths, options);
	console.log(res);
}

run();
