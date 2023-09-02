import { reactive } from "@reactively/core";

export const bench = (updates: number) => {
	const data = reactive(0);
	const B = reactive(() => data.get());
	const C = reactive(() => B.get());
	const D = reactive(() => C.get());
	for (let i = 0; i < updates; i++) {
		data.set(i);
		// Force reactively to recompute
		D.get();
	}
};
