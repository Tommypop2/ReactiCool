import {
	createEffect,
	createMemo,
	untrack,
	// getOwner,
	// createRoot,
	// mergeProps,
	// createComponent,
} from "../api";
const currentContext = null;
const sharedConfig = {};
const getOwner = null;
const mergeProps = null;
const createComponent = (Comp: any, props: any) => {
	return Comp(props);
};
const createRoot = (fn: () => any) => fn();
export {
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

// const getOwner = null;
// const mergeProps = null;
// const root = (fn: () => any) => fn();
// const createComponent = (Comp: any, props: any) => {
// 	return Comp(props);
// };
