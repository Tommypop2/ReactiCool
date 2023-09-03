import {
	ParentProps,
	createEffect,
	createMemo,
	createSignal,
	on,
} from "@reacticool/web";
import { JSX } from "dom-expressions/src/jsx";
export const [location, setLocation] = createSignal(
	window.location.href.replace(window.location.origin, "")
);
createEffect(
	on(
		location,
		() => {
			window.history.pushState(undefined, "", location());
		},
		{ defer: true }
	)
);
export const Routes = (props: ParentProps) => {
	const children = props.children;
	let routes = (Array.isArray(children)
		? children
		: [children]) as any as RouteProps[];
	const index = createMemo(() =>
		routes.findIndex((r) => r.href === location())
	);
	// Bug in library that forces us to do this
	const node: HTMLDivElement = (<div></div>) as HTMLDivElement;
	createEffect(() => node.replaceChildren(routes[index()].comp() as any));
	return node;
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
		<a onClick={() => setLocation(props.href)} class={props.class}>
			{props.children}
		</a>
	);
};
