import { Computation } from "../core";
export { batch, untrack } from "../core";
export const createEffect = <T>(fn: () => T, name?: string) => {
	new Computation(fn, { name });
};
export const createMemo = <T>(fn: () => T, name?: string) => {
	const comp = new Computation(fn, { name });
	return comp.read.bind(comp);
};
export const createSignal = <T>(initial: T, name?: string) => {
	const comp = new Computation(initial, { name });
	return [comp.read.bind(comp), comp.write.bind(comp)] as const;
};
