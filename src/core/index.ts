export const COMPUTATIONS: Computation<any>[] = [];
/**
 * The current observer
 * This is used to determine whether or not a node should be added to `COMPUTATIONS`
 */
let OBSERVED: boolean = false;
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
export const clearComputations = () => {
	COMPUTATIONS.length = 0;
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
	name?: string;
	fn: () => T;
	equals: (a: T, b: T) => boolean = (a, b) => a === b;
	constructor(
		fnOrVal: T | (() => T),
		options?: { name?: string; equals?: typeof Computation.prototype.equals }
	) {
		this.name = options?.name;
		if (options?.equals) {
			this.equals = options.equals;
		}
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
	write = (val: T) => {
		if (this.equals(val, this.value) || this.slot === null) return;
		this.value = val;
		// If there is no stop value, then this node has no dependencies
		if (!this.stop) return;
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
