import { createMemo, createSignal } from "../src";

// export const bench = (updates: number) => {
// 	const [get, set] = createSignal(0);
// 	const B = createMemo(() => get());
// 	const C = createMemo(() => B());
// 	const D = createMemo(() => C());
// 	for (let i = 0; i < updates; i++) {
// 		set(i);
// 		D();
// 	}
// };

export default {
	name: "ReactiCool",
	signal: createSignal,
	memo: createMemo,
};
