import { describe, expect, test } from "vitest";
import { createEffect, createSignal, onCleanup } from "../src";

describe("cleanups", () => {
	test("A computation's cleanup is called before it re-executes", () => {
		const [A, setA] = createSignal(0);
		let cleanups = 0;
		createEffect(() => {
			A();
			onCleanup(() => {
				cleanups++;
			});
		});
		expect(cleanups).toBe(0);
		setA(1);
		expect(cleanups).toBe(1);
	});
});
