import { Computation } from "../core";

export const createEffect = <T>(fn: () => T) => {
	new Computation(fn);
};
export const createMemo = <T>(fn: () => T) => {
	return new Computation(fn).read;
};
export const createSignal = <T>(initial: T) => {
	const { read, write } = new Computation(initial);
	return [read, write] as const;
};
