export const COMPUTATIONS: Computation<any>[] = [];
/**
 * The current observer
 * This is used to determine whether or not a node should be added to `COMPUTATIONS`
 * and to set the `stop` index for this node
 */
let OBSERVER: Computation<any> | null = null;
export const runUpdates = (start: number, stop: number) => {
	for (let i = start; i <= stop; i++) {
		const comp = COMPUTATIONS[i];
		if(comp.stop && comp.stop > stop) {
			stop = comp.stop;
		}
		comp.value = comp.fn();
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
	signal: boolean = false;
	name?: string;
	fn: () => T;
	constructor(fnOrVal: T | (() => T), name?: string) {
		this.name = name;
		if (typeof fnOrVal !== "function") {
			let value = fnOrVal;
			fnOrVal = () => value;
			this.signal = true;
		}
		this.fn = fnOrVal as () => T;
		const prev = OBSERVER;
		OBSERVER = this;
		this.value = this.fn();
		OBSERVER = prev;
		if (this.slot === null) {
			this.slot = COMPUTATIONS.length;
			this.stop = COMPUTATIONS.length;
			COMPUTATIONS.push(this);
		}
	}
	read = () => {
		if (OBSERVER) this.stop = COMPUTATIONS.length;
		if (OBSERVER && this.slot === null) {
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
