const { hooks } = require("@adonisjs/ignitor");
const path = require("path");

const LOAD_MANIFEST = (filePath) => {
	const fs = use("fs");
	let manifest = null;
	try {
		if (fs.existsSync(filePath)) manifest = use(filePath);
		else console.log(`${filePath} does not exist`);
	} catch (err) {
		manifest = null;
		console.error(err);
	}
	return manifest;
};

hooks.after.providersBooted(async () => {
	const View = use("View");

	const constants = require(path.join(__dirname, "..", "constants.js"));
	const manifest = LOAD_MANIFEST(path.join(__dirname, "..", "public", "build", "manifest.json"));

	let SCRIPT = `<script type="module" src="http://localhost:3000/@vite/client"></script>
  <script type="module" src="http://localhost:3000/${constants.ENTRY}"></script>`;

	let CSS = "";

	if (manifest) {
		const manObj = manifest[constants.ENTRY];
		SCRIPT = `<script type="module" src="/build/${manObj.file}"></script>`;
		if (manObj.css && manObj.css.length > 0) CSS = `<link rel="stylesheet" href="/build/${manObj.css[0]}">`;
	}

	View.global("VITE", (css) => {
		if (css) return CSS;
		return SCRIPT;
	});
});
