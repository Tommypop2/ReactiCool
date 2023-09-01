import { describe, expect, test } from "vitest";
import { createEffect, createSignal, untrack } from "../src";

describe("untrack", () => {
	test("A signal can be untracked", () => {
		const [get, set] = createSignal(0);
		let updates = 0;
		createEffect(() => {
			untrack(get);
			updates++;
		});
		expect(updates).toBe(1);
		set(1);
		expect(updates).toBe(1);
	});
});
