import { reactive } from "@reactively/core";

export const bench = (updates: number) => {
	const thing = reactive(0);
	reactive(() => {
		thing.get();
	});
	for (let i = 0; i < updates; i++) {
		thing.set(i);
	}
};
