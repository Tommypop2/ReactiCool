import { describe, expect, test } from "vitest";
import { createMemo, createSignal } from "../src";
import { e } from "vitest/dist/reporters-2ff87305";

describe("memos", () => {
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
		const [A, setA] = createSignal(1);
		let updatesB = 0;
		const B = createMemo(() => {
			updatesB++;
			return A() + 1;
		});
		let updatesC = 0;
		const C = createMemo(() => {
			updatesC++;
			return A() + 2;
		});
		let updatesD = 0;
		const D = createMemo(() => {
			updatesD++;
			return B() + C();
		});
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
});
