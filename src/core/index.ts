export const COMPUTATIONS: Computation<any>[] = [];
/**
 * The current observer
 * This is used to determine whether or not a node should be added to `COMPUTATIONS`
 */
let OBSERVED: boolean = false;
export const runUpdates = (start: number, stop: number) => {
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
	constructor(fnOrVal: T | (() => T), name?: string) {
		this.name = name;
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
	read = () => {
		if (OBSERVED) this.stop = COMPUTATIONS.length;
		if (OBSERVED && this.slot === null) {
			this.slot = COMPUTATIONS.length;
			COMPUTATIONS.push(this);
		}
		return this.value;
	};
	write = (val: T) => {
		this.value = val;
		if (this.slot === null) return;
		runUpdates(this.slot + 1, this.stop ?? COMPUTATIONS.length - 1);
	};
}
