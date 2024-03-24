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
	sources: Computation[] = [];
	sourceSlots: number[] = [];
	observers: Computation[] = [];
	observerSlots: number[] = [];
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
		// this.sources.forEach((s) => s.observers.delete(this));
		// Below code works properly but is super slow
		// this.sources.forEach((s) => {
		// 	const ind = s.observers.indexOf(this);
		// 	if (ind < 0) return;
		// 	s.observers.splice(ind, 1);
		// });
		for (let i = 0; i < this.sources.length; i++) {
			const s = this.sources[i];
			const ind = this.sourceSlots[i];
			s.observers.splice(ind, 1);
			this.sourceSlots.splice(i, 1);
		}
		this.sources.length = 0;
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
		if (OBSERVER !== null && OBSERVER.sources.indexOf(this) === -1) {
			this.observerSlots.push(OBSERVER.sources.length);
			OBSERVER.sources.push(this);

			OBSERVER.sourceSlots.push(this.observers.length);
			this.observers.push(OBSERVER);
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
