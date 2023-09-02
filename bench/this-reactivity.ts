import { batch, createMemo, createSignal } from "../src";

export default {
	name: "ReactiCool",
	signal: createSignal,
	memo: createMemo,
	batch,
};
