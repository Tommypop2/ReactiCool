import { createEffect, createSignal } from "../../src";
const render = (nodes: HTMLElement[], root: HTMLElement) => {
	root.append(...nodes);
};
const Counter = () => {
	const [count, setCount] = createSignal(0);
	const add = (x: number) => setCount(count() + x);
	const countStr = () => `Count: ${count()}`;
	const countNode = document.createElement("div");
	createEffect(() => {
		console.log("Effecting");
		countNode.textContent = countStr();
	});
	const incrementButton = document.createElement("button");
	incrementButton.textContent = "+";
	incrementButton.onclick = () => add(1);
	const decrementButton = document.createElement("button");
	decrementButton.textContent = "-";
	decrementButton.onclick = () => add(-1);
	return [incrementButton, countNode, decrementButton];
};

render(Counter(), document.body);
