import { describe, expect, test } from "vitest";
import { createSignal } from "../src";
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
});
