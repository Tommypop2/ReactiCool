import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.tsx"],
	target: "esnext",
	format: ["esm"],
	bundle: false,
	sourcemap: true,
	clean: true,
	esbuildOptions: (options) => {
		options.jsx = "preserve";
	},
	outExtension(ctx) {
		if (ctx.format === "esm") return { js: ".jsx" };
		return {};
	},
});
