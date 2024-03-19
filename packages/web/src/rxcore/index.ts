import {
	createEffect,
	createMemo,
	untrack,
	createSignal,
} from "@reacticool/reactivity";
const currentContext = null;
const sharedConfig = {};
const getOwner = null;
const mergeProps = null;
const createComponent = (Comp: any, props: any) => {
	return Comp(props);
};
const createRoot = (fn: () => any) => fn();

export {
	createSignal as signal, // Not needed for DOM expressions
	createRoot as root,
	createEffect as effect,
	createMemo as memo,
	currentContext,
	createComponent,
	untrack,
	sharedConfig,
	getOwner,
	mergeProps,
};
