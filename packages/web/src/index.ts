import { signal, effect, memo, untrack } from "./rxcore";
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
	className,
} from "dom-expressions/src/client";
export * from "@solid-cli/reactivity";
export type ParentProps = { children: JSX.Element[] | JSX.Element };
export const lazy = <T>(comp: () => Promise<{ default: () => T }>) => {
	const [getComp, setComp] = signal<JSX.Element | null>(null);
	return () => {
		const c = getComp();
		if (c === null) {
			comp().then((c) => setComp(c.default as any));
		}
		return c;
	};
};
