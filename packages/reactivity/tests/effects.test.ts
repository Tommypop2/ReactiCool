import { describe, expect, test } from "vitest";
import { createEffect, createSignal } from "../src";

describe("effects", () => {
	test("An effect runs when a signal it depends on updates", () => {
		const [get, set] = createSignal(1);
		let updates = 0;
		createEffect(() => {
			get();
			updates++;
		});
		expect(updates).toBe(1);
		set(2);
		expect(updates).toBe(2);
	});
	test("An effect can have multiple dependencies", () => {
		const [A, setA] = createSignal(1);
		const [B, setB] = createSignal(2);
		let updates = 0;
		createEffect(() => {
			updates++;
			A();
			B();
		});
		expect(updates).toBe(1);
		setA(2);
		expect(updates).toBe(2);
		setB(3);
		expect(updates).toBe(3);
	});
	test("A node that doesn't depend on anything shouldn't rerun when everything around it depends on the same node", () => {
		const [A, setA] = createSignal(0);
		createEffect(() => {
			A();
		});
		let updates = 0;
		createEffect(() => {
			updates++;
		});
		createEffect(() => {
			A();
		});
		expect(updates).toBe(1);
		setA(1);
		expect(updates).toBe(1);
	});
});
