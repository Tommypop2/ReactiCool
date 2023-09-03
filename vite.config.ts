import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
export default defineConfig({
	plugins: [
		babel({
			babelConfig: {
				plugins: [
					[
						"babel-plugin-transform-rename-import",
						{
							original: "rxcore",
							replacement: "../../../../../../src/dom-expressions-rx-core/index",
						},
					],
				],
			},
		}),
	],
	build: {
		lib: {
			name: "reactive-v3",
			entry: "./src/dom-expressions/index.ts",
		},
	},
});
