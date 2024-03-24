import { ref, computed, type UnwrapRef } from "@vue/reactivity";

export default {
	name: "Vue",
	signal: <T>(initial: T) => {
		const data = ref(initial);
		// biome-ignore lint/suspicious/noAssignInExpressions: Fine here to emulate Signal API
		return [() => data.value, (val: UnwrapRef<T>) => (data.value = val)];
	},
	memo: <T>(fn: () => T) => {
		const data = computed(fn);
		return () => data.value;
	},
	batch: <T>(fn: () => T) => {
		return fn();
	},
};
