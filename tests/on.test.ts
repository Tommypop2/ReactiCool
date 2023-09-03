import { describe, expect, test } from "vitest";
import { createEffect, createSignal, on } from "../src";

describe("on", () => {
	test("Dependencies within `on` are tracked", () => {
		const [get, set] = createSignal(0);
		let updates = 0;
		createEffect(
			on(get, () => {
				updates++;
			})
		);
		expect(updates).toBe(1);
		set(1);
		expect(updates).toBe(2);
	});
	test("Additional dependencies within the computation are untracked", () => {
		const [get, set] = createSignal(0);
		let updates = 0;
		createEffect(
			on([], () => {
				get();
				updates++;
			})
		);
		expect(updates).toBe(1);
		set(1);
		expect(updates).toBe(1);
	});
	test("The computation doesn't immediately run if `defer` is true", () => {
		const [get, set] = createSignal(0);
		let updates = 0;
		createEffect(
			on(
				get,
				() => {
					updates++;
				},
				{ defer: true }
			)
		);
		expect(updates).toBe(0);
		set(1);
		expect(updates).toBe(1);
	});
});
