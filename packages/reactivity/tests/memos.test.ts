import { describe, expect, test } from "vitest";
import { createMemo, createSignal } from "../src";

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
		expect(updates).toBe(1);
		expect(derived()).toBe(4);
		expect(updates).toBe(2);
	});
});
