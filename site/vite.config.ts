import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCss from "unocss/vite";
export default defineConfig({
	plugins: [
		UnoCss(),
		solid({
			solid: {
				moduleName: "@reacticool/web",
				delegateEvents: false,
			},
			dev: false,
			hot: false,
		}),
	],
});
