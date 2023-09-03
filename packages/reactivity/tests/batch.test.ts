import { describe, expect, test } from "vitest";
import { batch, createEffect, createSignal } from "../src";

describe("batch", () => {
	test("No computations are updated until batch ends", () => {
		let updates = 0;
		const [get, set] = createSignal(0);
		createEffect(() => {
			get();
			updates++;
		});
		expect(updates).toBe(1);
		batch(() => {
			set(1);
			expect(updates).toBe(1);
		});
		expect(updates).toBe(2);
	});
	test("No node is updated multiple times (updates are merged properly)", () => {
		const [A, setA] = createSignal(0);
		const [B, setB] = createSignal(0);
		let updates = 0;
		createEffect(() => {
			A();
			B();
			updates++;
		});
		expect(updates).toBe(1);
		batch(() => {
			setA(1);
			setB(1);
			expect(updates).toBe(1);
		});
		expect(updates).toBe(2);
	});
});
