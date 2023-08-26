const path = require("path");
const fs = require("fs");

function transformer(file, api, options) {
	const j = api.jscodeshift;

	if (!options.root) {
		throw new Error(
			"Please provide a directory for the root of all aliases using --root"
		);
	}
	const rootDir = path.join(process.cwd(), options.root);
	const files = fs
		.readdirSync(rootDir)
		.map((filepath) => filepath.replace(/\.(j|t)sx?$/, ""));

	const filepath = path.relative(rootDir, path.join(process.cwd(), file.path));

	const root = j(file.source);
	const getFirstNode = () => root.find(j.Program).get("body", 0).node;
	const originalFirstNode = getFirstNode();

	root.find(j.ImportDeclaration).forEach((nodepath) => {
		const source = nodepath.value.source.value;

		// Ignore imports that are not part of the root alias location
		if (!files.includes(source.split("/")[0])) {
			return;
		}

		let newSource = path.relative(
			path.join(rootDir, path.dirname(filepath)),
			path.join(rootDir, source)
		);
		if (/^\s+$/.test(newSource)) {
			newSource = ".";
		}
		if (!newSource.startsWith(".")) {
			newSource = `./${newSource}`;
		}

		j(nodepath).replaceWith(
			j.importDeclaration(
				nodepath.value.specifiers,
				j.literal(newSource),
				nodepath.value.importKind
			)
		);
	});

	// Preserve the leading comments at the beginning of files
	// https://github.com/facebook/jscodeshift/blob/main/recipes/retain-first-comment.md
	const newFirstNode = getFirstNode();
	if (newFirstNode !== originalFirstNode) {
		newFirstNode.comments = originalFirstNode?.comments;
	}

	return root.toSource({ quote: "single" });
}

module.exports = transformer;
