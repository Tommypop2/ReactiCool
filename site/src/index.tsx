import { Route, Routes } from "@reacticool/router";
import { Navbar } from "./Components/Navbar";
import { createEffect, createSignal, lazy, on, render } from "@reacticool/web";
import { Home } from "./Routes/Home";
// import About from "./Routes/About";
const About = lazy(() => import("./Routes/About"));
import "virtual:uno.css";
type Theme = "dark" | "light";
export const [theme, setTheme] = createSignal<Theme>(
	(localStorage.getItem("theme") as Theme) ?? "dark"
);
createEffect(
	on(theme, () => {
		localStorage.setItem("theme", theme());
	})
);
const Root = () => {
	return (
		<div class={`h-full ${theme()} overflow-clip`}>
			<div class="h-full dark:bg-dark dark:text-white transition-colors p-2">
				<div class="h-10">
					<Navbar
						routes={[
							{ name: "Home", href: "/" },
							{ name: "About", href: "/about" },
						]}
					/>
				</div>
				<Routes>
					<Route href="/" comp={Home}></Route>
					<Route href="/about" comp={About}></Route>
				</Routes>
			</div>
		</div>
	);
};
render(Root, document.getElementById("app")!);
