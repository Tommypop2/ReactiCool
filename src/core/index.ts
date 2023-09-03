// Types
export type Cleanup = () => any;
export type Getter<T = any> = () => T;
export type Setter<T = any> = (val: T) => void;
export type Signal<T = any> = [Getter<T>, Setter<T>];
/**
 * An array of nodes in their update order
 */
export const COMPUTATIONS: Computation[] = [];
/**
 * Whether or not the current computation is being observed
 * This is used to determine whether or not a node should be added to `COMPUTATIONS`
 */
let OBSERVED: boolean = false;
let BATCHING: boolean = false;
/**
 * Stores the nodes that need to be updated when the batch ends
 */
const BATCHEDUPDATES: Computation[] = [];
/**
 * The main computation class
 */
export class Computation<T = any> {
	/**
	 *  The index of this node in the COMPUTATIONS array
	 * */
	slot: number | null = null;
	/**
	 * The index of the last node that depends on this node
	 */
	stop: number | null = null;
	/**
	 * The index of the first node that this node depends upon
	 * This will be used to determine where this node's dependencies start, so dynamic dependencies can work
	 */
	depInd: number | null = null;
	/**
	 * Whether this computation is currently being batched
	 */
	batched: boolean = false;
	cleanups: Cleanup[] | null = null;
	value: T;
	name?: string;
	fn: (() => T) | null = null;
	equals: (a: T, b: T) => boolean;
	constructor(
		fnOrVal: T | (() => T),
		options?: { name?: string; equals?: typeof Computation.prototype.equals }
	) {
		this.name = options?.name;
		this.equals = options?.equals ?? ((a, b) => a === b);
		// If a computation is pushed to the array while being observed, it will push itself to this array, and will be the first dependency
		this.depInd = COMPUTATIONS.length;
		if (typeof fnOrVal !== "function") {
			this.value = fnOrVal;
		} else {
			this.fn = fnOrVal as () => T;
			const prev = OBSERVED;
			OBSERVED = true;
			this.value = this.fn();
			OBSERVED = prev;
		}
		if (this.slot === null) {
			this.slot = COMPUTATIONS.length;
			COMPUTATIONS.push(this);
		}
		// If this node's slot in the array is the same as the index to its first dependency, then it has no dependencies
		if (this.depInd === this.slot) this.depInd = null;
	}
	/**
	 * Reads the current value of the computation - tracking it as a dependency of the current observer
	 * @returns The current value of the computation
	 */
	read() {
		if (OBSERVED) {
			this.stop = COMPUTATIONS.length;
			if (this.slot === null) {
				this.slot = COMPUTATIONS.length;
				COMPUTATIONS.push(this);
			}
		}
		return this.value;
	}
	/**
	 * Writes a value to the computation
	 * @param val The value to write
	 */
	write(val: T) {
		if (this.equals(val, this.value) || this.slot === null) return;
		this.value = val;
		// If there is no stop value, then this node has no dependencies
		if (this.stop === null) return;
		if (BATCHING === true) {
			if (this.batched === false) {
				BATCHEDUPDATES.push(this);
				this.batched = true;
			}
			return;
		}
		stabilize(this.slot + 1, this.stop);
	}
	/**
	 * Removes the computation from the array, and runs its cleanups. This means it can get garbage collected
	 */
	cleanup = () => {
		if (this.slot === null) return;
		COMPUTATIONS.splice(this.slot, 1);
		this.slot = null;
		if (this.cleanups === null) return;
		this.cleanups.forEach((cleanup) => cleanup());
		this.cleanups = null;
	};
}
/**
 * Batches changes together
 */
export const batch = <T>(fn: () => T) => {
	if (BATCHING) return fn();
	BATCHING = true;
	const res = fn();
	BATCHING = false;
	let prevStop = -1;
	for (const comp of BATCHEDUPDATES) {
		if (comp.slot! <= prevStop) continue;
		prevStop = comp.stop!;
		stabilize(comp.slot! + 1, comp.stop!);
	}
	BATCHEDUPDATES.length = 0;
	return res;
};
/**
 * Stabilizes nodes between the `start`, and `stop` indexes
 * @param start The index to start stabilzing from
 * @param stop The index to stop stabilzing at
 */
export const stabilize = (start: number, stop: number) => {
	for (let i = start; i <= stop; i++) {
		const comp = COMPUTATIONS[i];
		if (comp.fn === null) continue;
		const newVal = comp.fn();
		// Don't need to increase `stop` if the value hasn't changed
		if (newVal === comp.value) continue;
		// We always want to iterate until the the greatest stop value
		// This ensures that all dirty nodes are updated
		if (comp.stop !== null && comp.stop > stop) {
			stop = comp.stop;
		}
		comp.value = newVal;
	}
};
/**
 * Untracks a function. This means that any read computations will not be tracked as dependencies
 */
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
