import { ref, computed } from "@vue/reactivity";
export const bench = (updates: number) => {
	const data = ref(0);
	const B = computed(() => data.value);
	const C = computed(() => B.value);
	const D = computed(() => C.value);
	for (let i = 0; i < updates; i++) {
		data.value = i;
		// Force vue to recompute
		D.value;
	}
};
