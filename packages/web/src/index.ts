import { JSX } from "dom-expressions/src/jsx";

export {
	insert,
	render,
	delegateEvents,
	template,
	setAttribute,
	createComponent,
	memo,
	effect,
	classList,
	className
} from "dom-expressions/src/client";
export * from "@reacticool/reactivity";
export type ParentProps = { children: JSX.Element[] | JSX.Element };
