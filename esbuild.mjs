/**
 * Build src/client.jsx into the lib/client.js browser bundle the DSH web
 * shell loads (window.__ModuleLoader__ lazy-CJS shape, matching the official
 * dsh-client-ui-* packages). react, react/jsx-runtime and the primitives
 * package stay external: the host module system provides them at
 * materialization time through the factory require. lib/ stays committed so
 * the documented copy-into-profile install works without a build step.
 */
import { build } from "esbuild";
import { readFile, stat } from "node:fs/promises";

const pkg = JSON.parse(await readFile(new URL("./package.json", import.meta.url), "utf8"));
const banner = [
	"window.__ModuleLoader__.load({",
	'\tid: "' + pkg.name + '",',
	"\tfactory: (require) => {",
	"\t\tvar module = { exports: {} };",
	"\t\tvar exports = module.exports;",
	'\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: "Module" });',
].join("\n");

const footer = ["\t\treturn module.exports;", "\t}", "});", ""].join("\n");

await build({
	entryPoints: ["src/client.jsx"],
	outfile: "lib/client.js",
	bundle: true,
	format: "cjs",
	platform: "browser",
	target: ["es2022"],
	charset: "ascii",
	jsx: "automatic",
	external: ["react", "react/jsx-runtime", "@deepseek-ai/dsh-client-ui-primitives"],
	banner: { js: banner },
	footer: { js: footer },
	logLevel: "info"
});

const size = (await stat("lib/client.js")).size;
if (size < 10000) {
	console.error("built bundle is suspiciously small (" + size + " bytes) - failing the build");
	process.exit(1);
}
console.log("lib/client.js: " + size + " bytes");