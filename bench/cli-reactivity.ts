import { createMemo, createSignal } from "@solid-cli/reactivity";

export const bench = (updates: number) => {
	const [get, set] = createSignal(0);
	const B = createMemo(() => get());
    const C = createMemo(() => B());
    const D = createMemo(() => C());
	for (let i = 0; i < updates; i++) {
		set(i);
	}
};
