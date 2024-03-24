import { describe, expect, test } from "vitest";
import { createEffect, createSignal } from "../src";
describe("Signals", () => {
	test("A signal contains a value", () => {
		const [get, set] = createSignal(1);
		expect(get()).toBe(1);
	});
	test("A signal can be updated", () => {
		const [get, set] = createSignal(1);
		expect(get()).toBe(1);
		set(2);
		expect(get()).toBe(2);
	});
	test("A signal, when depended on multiple times doesn't cause multiple updates", () => {
		const [get, set] = createSignal(0);
		let updates = 0;
		createEffect(() => {
			get();
			get();
			updates++;
		});
		expect(updates).toBe(1);
		set(1);
		expect(updates).toBe(2);
	});
});
