import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCss from "unocss/vite";
export default defineConfig({
	plugins: [
		// babel({
		// 	babelConfig: {
		// 		plugins: [
		// 			["babel-plugin-jsx-dom-expressions", { moduleName: "mobx-jsx" }],
		// 		],
		// 	},
		// }),
		UnoCss(),
		solid({
			solid: {
				moduleName: "../../dist/array-based-reactive.js",
				delegateEvents: false,
			},
			dev: false,
			hot: false,
		}),
	],
});
