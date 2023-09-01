import { Computation } from "../core";
export { batch } from "../core";
export const createEffect = <T>(fn: () => T, name?: string) => {
	new Computation(fn, { name });
};
export const createMemo = <T>(fn: () => T, name?: string) => {
	return new Computation(fn, { name }).read;
};
export const createSignal = <T>(initial: T, name?: string) => {
	const { read, write } = new Computation(initial, { name });
	return [read, write] as const;
};
