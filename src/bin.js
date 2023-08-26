const { program } = require('commander');
const { run: jscodeshift } = require('jscodeshift/src/Runner');
const path = require('node:path');

program
	.name('remove-aliasing')
	.description('Rewrites imports to remove module aliasing')
	.argument('<directory>', 'Directory to parse and rewrite')
	.option('--dry-run', 'Do not actually write, just see what will happen')
	.requiredOption('-r, --root <dir>', 'Directory that serves as the root of aliased files')
	.option('-p, --prefix <prefix>', 'Import path prefix');

program.parse();

const argv = program.opts();

const paths = argv.directory;

const transformPath = path.resolve('./index.js');
const options = {
	dry: !!argv['dry-run'],
	print: true,
	root: options.root,
	prefix: options.prefix,
};

async function run() {
	const res = await jscodeshift(transformPath, paths, options);
	console.log(res);
}

run();
