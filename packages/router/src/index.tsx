import {
	type ParentProps,
	createEffect,
	createMemo,
	createSignal,
	on,
} from "@reacticool/web";
import type { JSX } from "dom-expressions/src/jsx";
export const [location, setLocation] = createSignal(
	window.location.href.replace(window.location.origin, ""),
);
createEffect(
	on(
		location,
		() => {
			window.history.pushState(undefined, "", location());
		},
		{ defer: true },
	),
);
const unwrap = (fn: () => any) => {
	const res = fn();
	if (typeof res === "function") return unwrap(res);
	return res;
};
export const Routes = (props: ParentProps) => {
	const children = props.children;
	const routes = (Array.isArray(children)
		? children
		: [children]) as any as RouteProps[];
	const index = createMemo(() =>
		routes.findIndex((r) => r.href === location()),
	);
	const matched = createMemo(() => {
		const i = index();
		if (i < 0) return;
		return routes[i].comp();
	});
	const container = (<div />) as HTMLDivElement;
	createEffect(() => {
		container.innerHTML = "";
		const unwrapped = unwrap(matched);
		console.log(unwrapped);
		Array.isArray(unwrapped)
			? container.append(...unwrapped)
			: container.append(unwrapped);
	});
	return container;
};
type RouteProps = {
	href: string;
	comp: () => JSX.Element;
};
export const Route = (props: RouteProps) => {
	return <>{props}</>;
};
type AnchorProps = {
	href: string;
	class: string;
};
export const A = (props: AnchorProps & ParentProps) => {
	return (
		// biome-ignore lint/a11y/useValidAnchor: Router needs to use anchor tags
		<a onClick={() => setLocation(props.href)} class={props.class}>
			{props.children}
		</a>
	);
};
