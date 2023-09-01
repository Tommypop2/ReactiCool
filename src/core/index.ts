export const COMPUTATIONS: Computation<any>[] = [];
/**
 * The current observer
 * This is used to determine whether or not a node should be added to `COMPUTATIONS`
 */
let OBSERVED: boolean = false;
let BATCHING: boolean = false;
const BATCHEDUPDATES: { start: number; stop: number }[] = [];

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
	name?: string;
	fn: () => T;
	equals: (a: T, b: T) => boolean;
	constructor(
		fnOrVal: T | (() => T),
		options?: { name?: string; equals?: typeof Computation.prototype.equals }
	) {
		this.name = options?.name;
		this.equals = options?.equals ?? ((a, b) => a === b);
		if (typeof fnOrVal !== "function") {
			let value = fnOrVal;
			fnOrVal = () => value;
		}
		this.fn = fnOrVal as () => T;
		const prev = OBSERVED;
		OBSERVED = true;
		this.value = this.fn();
		OBSERVED = prev;
		if (this.slot === null) {
			this.slot = COMPUTATIONS.length;
			COMPUTATIONS.push(this);
		}
	}
	/**
	 * Reads the current value of the computation - tracking it as a dependency of the current observer
	 * @returns The current value of the computation
	 */
	read = () => {
		if (OBSERVED) this.stop = COMPUTATIONS.length;
		if (OBSERVED && this.slot === null) {
			this.slot = COMPUTATIONS.length;
			COMPUTATIONS.push(this);
		}
		return this.value;
	};
	/**
	 * Writes a value to the computation
	 * @param val The value to write
	 */
	write = (val: T) => {
		if (this.equals(val, this.value) || this.slot === null) return;
		this.value = val;
		// If there is no stop value, then this node has no dependencies
		if (!this.stop) return;
		if (BATCHING) {
			BATCHEDUPDATES.push({ start: this.slot + 1, stop: this.stop });
			return;
		}
		stabilize(this.slot + 1, this.stop);
	};
	/**
	 * Removes the computation from the array. This means it can get garbage collected
	 */
	cleanup = () => {
		if (this.slot === null) return;
		COMPUTATIONS.splice(this.slot, 1);
		this.slot = null;
	};
}
/**
 * Merges all the overlapping batched update indexes, so we don't update the same node twice
 */
const mergeUpdates = () => {
	for (let i = 0; i < BATCHEDUPDATES.length; i++) {
		const mainUpdate = BATCHEDUPDATES[i];
		for (let j = i + 1; j < BATCHEDUPDATES.length; j++) {
			const otherUpdate = BATCHEDUPDATES[j];
			if (
				otherUpdate.stop > mainUpdate.stop &&
				otherUpdate.start <= mainUpdate.stop
			) {
				mainUpdate.stop = otherUpdate.stop;
				BATCHEDUPDATES.splice(j, 1);
			}
			if (
				otherUpdate.start < mainUpdate.start &&
				otherUpdate.stop <= mainUpdate.stop
			) {
				mainUpdate.start = otherUpdate.start;
				BATCHEDUPDATES.splice(j, 1);
			}
			if (
				otherUpdate.start >= mainUpdate.start &&
				otherUpdate.stop <= mainUpdate.stop
			) {
				BATCHEDUPDATES.splice(j, 1);
			}
		}
	}
};
export const batch = <T>(fn: () => T) => {
	BATCHING = true;
	const res = fn();
	BATCHING = false;
	mergeUpdates();
	for (const { start, stop } of BATCHEDUPDATES) {
		stabilize(start, stop);
	}
	return res;
};
export const stabilize = (start: number, stop: number) => {
	for (let i = start; i <= stop; i++) {
		const comp = COMPUTATIONS[i];
		const newVal = comp.fn();
		// We always want to iterate until the the greatest stop value
		// This ensures that all dirty nodes are updated
		// We can also not bother updating the stop value if this node's value hasn't changed.
		// This means that the nodes depending on it are clean
		if (comp.stop && comp.stop > stop && newVal != comp.value) {
			stop = comp.stop;
		}
		comp.value = newVal;
	}
};
export const untrack = <T>(fn: () => T) => {
	const prev = OBSERVED;
	OBSERVED = false;
	const res = fn();
	OBSERVED = prev;
	return res;
};
export const clearComputations = () => {
	COMPUTATIONS.length = 0;
};
