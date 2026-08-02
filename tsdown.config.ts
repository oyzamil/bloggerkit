import { readFileSync } from "node:fs";
import { defineConfig, type UserConfig } from "tsdown";

const pkg = JSON.parse(
	readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);

const shared: UserConfig = {
	sourcemap: !true,
	target: "es2022",
	outputOptions(options, format) {
		options.banner = `/* blogr v${pkg.version} - ${format} | MIT License */`;
		options.exports = format === "iife" ? "default" : "named";
		return options;
	},
};

export default defineConfig([
	{
		...shared,
		entry: { blogr: "src/index.ts" },
		format: ["esm", "cjs"],
		dts: true,
		clean: true,
		minify: false,
		outExtensions({ format }) {
			return {
				js: format === "es" ? ".esm.js" : ".cjs",
				dts: format === "es" ? ".ts" : ".cts",
			};
		},
	},
	{
		...shared,
		entry: { blogr: "src/index.ts" },
		format: ["esm", "cjs"],
		dts: false,
		clean: false,
		minify: true,
		outExtensions({ format }) {
			return { js: format === "es" ? ".esm.min.js" : ".min.cjs" };
		},
	},
	{
		...shared,
		entry: { blogr: "src/browser.ts" },
		format: ["iife"],
		globalName: "Blogr",
		dts: false,
		clean: false,
		minify: false,
		outputOptions(options, format) {
			options.banner = `/* blogr v${pkg.version} - ${format} | MIT License */`;
			options.exports = "default";
			options.entryFileNames = "blogr.js";
			return options;
		},
	},
	{
		...shared,
		entry: { blogr: "src/browser.ts" },
		format: ["iife"],
		globalName: "Blogr",
		dts: false,
		clean: false,
		minify: true,
		outputOptions(options, format) {
			options.banner = `/* blogr v${pkg.version} - ${format} | MIT License */`;
			options.exports = "default";
			options.entryFileNames = "blogr.min.js";
			return options;
		},
	},
]);
