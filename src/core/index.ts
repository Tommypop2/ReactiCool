export const COMPUTATIONS: Computation<any>[] = [];
let hasObserver = false;
export const runUpdates = (start: number, stop: number) => {
	let updatedComputations = false;
	for (let i = start; i <= stop; i++) {
		const comp = COMPUTATIONS[i];
		// If the current computation is a signal, and we've already updated computations, the loop can stop here
		// This doesn't really work because of edge cases where computations in the order "signal, effect, signal, effect" would cause
		// issues updating the second effect when the first signal updates. The solution here would be to store a stop index for each node,
		// which is where we finish looping to on updates
		if (comp.signal && updatedComputations) break;

		if (!comp.signal) updatedComputations = true;
		comp.value = comp.fn();
	}
};
export class Computation<T> {
	/**
	 *  The index of this node in the COMPUTATIONS array
	 * */
	slot: number | null = null;
	/**
	 * The index of the last node that depends on this node
	 */
	stop: number | null = null;
	value: T;
	signal: boolean = false;
	fn: () => T;
	constructor(fnOrVal: T | (() => T)) {
		if (typeof fnOrVal !== "function") {
			let value = fnOrVal;
			fnOrVal = () => value;
			this.signal = true;
		}
		this.fn = fnOrVal as () => T;
		const prev = hasObserver;
		hasObserver = true;
		this.value = this.fn();
		hasObserver = prev;
		if (this.slot === null) {
			this.slot = COMPUTATIONS.length;
			COMPUTATIONS.push(this);
		}
	}
	read = () => {
		if (hasObserver && this.slot === null) COMPUTATIONS.push(this);
		return this.value;
	};
	write = (val: T) => {
		this.value = val;
		if (this.slot === null) return;
		runUpdates(this.slot + 1, COMPUTATIONS.length - 1);
	};
}
