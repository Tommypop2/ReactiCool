import { createEffect, createSignal } from "../src";

export const bench = (updates: number) => {
	const [get, set] = createSignal(0);
	createEffect(() => {
		get();
	});
	for (let i = 0; i < updates; i++) {
		set(i);
	}
};
