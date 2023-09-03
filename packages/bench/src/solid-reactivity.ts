// @ts-ignore
import { createMemo, createSignal, batch } from "solid-js/dist/solid.js";

export default {
	name: "Solid-JS",
	signal: createSignal,
	memo: createMemo,
	batch,
};
