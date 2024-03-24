import { describe, expect, test } from "vitest";
import { createEffect, createMemo, createSignal } from "../src";

describe("Graphs", () => {
	test("Small static reactive graph", () => {
		const [A, setA] = createSignal(0);
		const [B, setB] = createSignal(1);
		const C = createMemo(() => A() * 4);
		const D = createMemo(() => B() + 2);
		const E = createMemo(() => C() + D());
		let updates = 0;
		createEffect(() => {
			E();
			updates++;
		});
		expect(E()).toBe(3);
		expect(updates).toBe(1);
		setA(1);
		expect(E()).toBe(7);
		expect(updates).toBe(2);
	});
});
