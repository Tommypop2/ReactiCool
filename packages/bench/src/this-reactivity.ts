import { batch, createMemo, createSignal } from "../../reactivity/src";

export default {
	name: "ReactiCool",
	signal: createSignal,
	memo: createMemo,
	batch,
};
