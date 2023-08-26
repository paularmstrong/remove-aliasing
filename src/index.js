const path = require('node:path');
const fs = require('node:fs');

function transformer(file, api, options) {
	const j = api.jscodeshift;

	if (!options.root) {
		throw new Error('Please provide a directory for the root of all aliases using --root');
	}
	const rootDir = path.resolve(process.cwd(), options.root);
	const rootFiles = fs.readdirSync(rootDir).map((filepath) => filepath.replace(/\.(j|t)sx?$/, ''));

	const filepath = path.resolve(rootDir, file.path);

	const root = j(file.source);
	const getFirstNode = () => root.find(j.Program).get('body', 0).node;
	const originalFirstNode = getFirstNode();

	root.find(j.ImportDeclaration).forEach((nodepath) => {
		let source = `${nodepath.value.source.value}`;
		if (options.prefix) {
			if (!source.startsWith(options.prefix)) {
				return;
			}
			source = source.replace(options.prefix, '');
		}

		// Ignore imports that are not part of the root alias location
		if (!rootFiles.includes(source.split('/')[0])) {
			return;
		}

		let newSource = path.relative(path.resolve(rootDir, path.dirname(file.path)), path.join(rootDir, source));

		// empty string means same directory index file
		if (/^\s+$/.test(newSource)) {
			newSource = '.';
		}

		// ensure the path is relative
		if (!newSource.startsWith('.')) {
			newSource = `./${newSource}`;
		}

		// remove trailing slash, it's unnecessary
		newSource.replace(/\/$/, '');

		j(nodepath).replaceWith(
			j.importDeclaration(nodepath.value.specifiers, j.literal(newSource), nodepath.value.importKind),
		);
	});

	// Preserve the leading comments at the beginning of files
	// https://github.com/facebook/jscodeshift/blob/main/recipes/retain-first-comment.md
	const newFirstNode = getFirstNode();
	if (newFirstNode !== originalFirstNode) {
		newFirstNode.comments = originalFirstNode?.comments;
	}

	return root.toSource({ quote: 'single' });
}

module.exports = transformer;
