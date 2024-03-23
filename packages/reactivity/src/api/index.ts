import {
	Computation,
	batch,
	getCurrentObserver,
	isBatching,
	runWithObserver,
} from "../core";
export type Getter<T = any> = () => T;
export type Setter<T = any> = (v: T) => void;
export type Signal<T = any> = [Getter<T>, Setter<T>];
export const createSignal = <T>(val: T, _id?: string): Signal<T> => {
	const comp = new Computation(val);
	return [comp.read, comp.write];
};
export const createMemo = <T>(fn: () => T): Getter<T> => {
	const comp = new Computation(fn);
	return comp.read;
};
export const createEffect = (fn: () => any) => {
	new Computation(fn, true);
};
export const untrack = <T>(fn: () => T) => runWithObserver(null, fn);

export const on = <T>(
	deps: Getter | Getter[],
	fn: () => T,
	opts: { defer: boolean } = { defer: false }
) => {
	let defer = opts.defer;
	return () => {
		Array.isArray(deps) ? deps.forEach((d) => d()) : deps();
		if (defer) {
			defer = false;
			return;
		}
		untrack(fn);
	};
};
export const onCleanup = (fn: () => any) => {
	const observer = getCurrentObserver();
	if (observer) {
		observer.cleanups.push(fn);
	}
};
export { batch, getCurrentObserver, isBatching, runWithObserver };
