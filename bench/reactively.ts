import { reactive } from "@reactively/core";

export default {
	name: "Reactively",
	signal: <T>(initial: T) => {
		const data = reactive(initial);
		return [() => data.get, (val: T) => data.set(val)] as const;
	},
	memo: <T>(fn: () => T) => {
		const data = reactive(fn);
		return () => data.get();
	},
};
