import { afterEach, describe, expect, test } from "vitest";
import { createMemo, createSignal } from "../src";
import { clearComputations } from "../src/core";

describe("memos", () => {
	afterEach(() => {
		clearComputations();
	});
	test("Memos update when their dependencies change", () => {
		const [get, set] = createSignal(1);
		let updates = 0;
		const derived = createMemo(() => {
			updates++;
			return get() * 2;
		});
		expect(updates).toBe(1);
		expect(derived()).toBe(2);
		set(2);
		expect(updates).toBe(2);
		expect(derived()).toBe(4);
	});
	test("Diamond problem is solved", () => {
		const [A, setA] = createSignal(1, "A");
		let updatesB = 0;
		const B = createMemo(() => {
			updatesB++;
			return A() + 1;
		}, "B");
		let updatesC = 0;
		const C = createMemo(() => {
			updatesC++;
			return A() + 2;
		}, "C");
		let updatesD = 0;
		const D = createMemo(() => {
			updatesD++;
			return B() + C();
		}, "D");
		expect(D()).toBe(5);
		expect([updatesB, updatesC, updatesD]).toStrictEqual([1, 1, 1]);
		setA(2);
		expect(D()).toBe(7);
		expect([updatesB, updatesC, updatesD]).toStrictEqual([2, 2, 2]);
	});
	test("Updates don't continue propagating down the array", () => {
		const [A, setA] = createSignal(1);
		let updatesA = 0;
		const derivedA = createMemo(() => {
			updatesA++;
			return A() + 1;
		});
		const [B, setB] = createSignal(2);
		let updatesB = 0;
		const derivedB = createMemo(() => {
			updatesB++;
			return B() + 1;
		});
		expect(updatesA).toBe(1);
		expect(updatesB).toBe(1);
		setA(2);
		expect(updatesA).toBe(2);
		expect(updatesB).toBe(1);
	});
	test("Separate trees don't update each other", () => {
		const [A, setA] = createSignal(0, "A");
		const B = createMemo(() => A() + 1, "B");

		const [X, setX] = createSignal(0, "X");
		let updatesY = 0;
		const Y = createMemo(() => {
			updatesY++;
			return X() + 1;
		}, "Y");
		expect(updatesY).toBe(1);
		setA(1);
		expect(updatesY).toBe(1);
		setX(1);
		expect(updatesY).toBe(2);
	});
	test("A memo depending on a signal created before another computation is updated correctly", () => {
		const [A, setA] = createSignal(0, "A");
		const B = createMemo(() => A() + 1, "B");
		const [C, setC] = createSignal(0, "C");
		let updatesD = 0;
		const D = createMemo(() => {
			updatesD++;
			return A() + C();
		}, "D");
		expect(updatesD).toBe(1);
		setA(1);
		expect(updatesD).toBe(2);
		setC(1);
		expect(updatesD).toBe(3);
		expect(D()).toBe(2);
	});
});
