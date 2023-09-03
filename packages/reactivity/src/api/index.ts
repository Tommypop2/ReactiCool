import { Computation, Getter, Signal, untrack } from "../core";
export { batch, untrack } from "../core";
export const createEffect = <T>(fn: () => T, name?: string) => {
	new Computation(fn, { name });
};
export const createMemo = <T>(fn: () => T, name?: string): Getter<T> => {
	const comp = new Computation(fn, { name });
	return comp.read.bind(comp);
};
export const createSignal = <T>(initial: T, name?: string): Signal<T> => {
	const comp = new Computation(initial, { name });
	return [comp.read.bind(comp), comp.write.bind(comp)];
};
type OnOptions = {
	defer: boolean;
};
export const on = <T>(
	deps: Getter[] | Getter,
	fn: () => T,
	opts?: OnOptions
) => {
	let defer = opts?.defer ?? false;
	return () => {
		Array.isArray(deps) ? deps.forEach((dep) => dep()) : deps();
		if (defer) {
			defer = false;
			return;
		}
		return untrack(fn);
	};
};
