import { Route, Routes } from "@reacticool/router";
import { Navbar } from "./Components/Navbar";
import { render } from "@reacticool/web";
import { Home } from "./Routes/Home";
import { About } from "./Routes/About";
import "virtual:uno.css";
const Root = () => {
	return (
		<div>
			<Navbar></Navbar>
			<Routes>
				<Route href="/" comp={Home}></Route>
				<Route href="/about" comp={About}></Route>
			</Routes>
		</div>
	);
};
render(Root, document.getElementById("app")!);
