const CLEAN = 0;
const CHECK = 1;
const DIRTY = 2;
type State = typeof CLEAN | typeof CHECK | typeof DIRTY;
let OBSERVER: Computation | null = null;
let BATCHING = false;
const EFFECTSQUEUE: Computation[] = [];
const stabilize = () => {
	EFFECTSQUEUE.forEach((e) => e.update());
	EFFECTSQUEUE.length = 0;
};
export class Computation<T = any> {
	// @ts-ignore
	value: T;
	sources: Set<Computation> = new Set();
	observers: Set<Computation> = new Set();
	cleanups: (() => void)[] = [];
	state: State = DIRTY;
	fn?: () => T;
	effect: boolean;
	queued: boolean | undefined = false;
	constructor(fnOrVal: (() => T) | T, effect = false) {
		if (typeof fnOrVal === "function") {
			this.fn = fnOrVal as any;
			this.effect = effect;
			this.update();
		} else {
			this.state = CLEAN;
			this.value = fnOrVal;
			this.effect = false;
		}
	}
	updateIfNecessary() {
		if (this.state === DIRTY) {
			this.update();
			this.observers.forEach((o) => o.mark(DIRTY));
		}
		if (this.state === CHECK) {
			this.sources.forEach((s) => s.updateIfNecessary());
			// If this node has been marked dirty by a source node updating
			if ((this.state as any) === DIRTY) {
				this.update();
				this.observers.forEach((o) => o.mark(DIRTY));
			}
		}
	}
	removeSources() {
		this.sources.forEach((s) => s.observers.delete(this));
		this.sources.clear();
	}
	executeCleanups() {
		this.cleanups.forEach((c) => c());
		this.cleanups.length = 0;
	}
	update() {
		this.executeCleanups();
		this.removeSources();
		const prev = OBSERVER;
		OBSERVER = this;
		this.value = this.fn!();
		OBSERVER = prev;
		this.state = CLEAN;
	}
	mark(state: State) {
		if (this.state === state) {
			return;
		}
		// Mark this node
		// If we're trying to mark an effect node, add it to the queue
		this.state = state;
		if (this.effect === true && this.queued === false) {
			EFFECTSQUEUE.push(this);
			return;
		}
		// Get child nodes to mark
		this.observers.forEach((o) => o.mark(CHECK));
	}
	read = () => {
		if (OBSERVER) {
			OBSERVER.sources.add(this);
			this.observers.add(OBSERVER);
		}
		this.updateIfNecessary();
		return this.value;
	};
	write = (v: T) => {
		if (v === this.value) return;
		this.value = v;
		// Mark child nodes
		this.observers.forEach((o) => o.mark(DIRTY));
		if (!BATCHING) stabilize();
	};
}
export const runWithObserver = <T>(
	observer: Computation | null,
	fn: () => T,
) => {
	const prev = OBSERVER;
	OBSERVER = observer;
	const r = fn();
	OBSERVER = prev;
	return r;
};
export const batch = <T>(fn: () => T) => {
	const prev = BATCHING;
	BATCHING = true;
	const r = fn();
	BATCHING = prev;
	stabilize();
	return r;
};
export const getCurrentObserver = () => OBSERVER;
export const isBatching = () => BATCHING;
