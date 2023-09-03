import { defineConfig } from "tsup";
import { readFile } from "fs/promises";
import { transformAsync } from "@babel/core";
export default defineConfig({
	entry: ["src/index.ts", "src/rxcore/index.ts"],
	target: "esnext",
	format: ["esm", "cjs"],
	sourcemap: true,
	clean: true,
	treeshake: true,
	// external: ["@reacticool/web"],
	esbuildPlugins: [
		{
			name: "replace-imports",
			setup: (build) => {
				build.onLoad({ filter: /.*/ }, async (args) => {
					const contents = await readFile(args.path);
					const result = await transformAsync(contents.toString(), {
						plugins: [
							[
								"babel-plugin-transform-rename-import",
								{
									original: "rxcore",
									replacement:
										"../../../../../../packages/web/src/rxcore/index",
								},
							],
							"@babel/plugin-transform-typescript",
						],
					});
					const code = result?.code ?? undefined;
					return { contents: code };
				});
			},
		},
	],
});
