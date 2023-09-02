import { ref, computed, UnwrapRef } from "@vue/reactivity";

export default {
	name: "Vue",
	signal: <T>(initial: T) => {
		const data = ref(initial);
		return [() => data.value, (val: UnwrapRef<T>) => (data.value = val)];
	},
	memo: <T>(fn: () => T) => {
		const data = computed(fn);
		return () => data.value;
	},
};
