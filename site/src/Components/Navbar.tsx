import { A } from "@reacticool/router";
import { theme, setTheme } from "..";
import { ParentProps, createMemo } from "@reacticool/web";
type NavbarProps = {
	routes: { name: string; href: string }[];
};
export function BsSunFill() {
	return (
		<svg
			fill="currentColor"
			stroke-width="0"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 16 16"
			// height="2em"
			width="2em"
			style="overflow: visible;"
		>
			<path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"></path>
		</svg>
	);
}
export function BsMoonFill() {
	return (
		<svg
			fill="currentColor"
			stroke-width="0"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 16 16"
			width="2em"
			style="overflow: visible;"
		>
			<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
		</svg>
	);
}
type ShowProps = {
	when: () => boolean;
};
const Show = (props: ShowProps & ParentProps) => {
	const children = props.children;
	const child = Array.isArray(children) ? children[0] : children;
	const visible = createMemo(() => {
		if (props.when()) {
			return child;
		} else {
			return null;
		}
	});
	return <div>{visible()}</div>;
};
export const Navbar = (props: NavbarProps) => {
	return (
		<div class="flex flex-row w-full h-full gap-1 m-0 p-0">
			<div class="h-full flex">
				{props.routes.map((r) => (
					<A
						href={r.href}
						class="inline-flex items-center m-0 px-5 py-3 rounded-t-1 no-underline text-lg"
					>
						{r.name}
					</A>
				))}
			</div>
			<div class="flex flex-row ml-auto gap-2 mr-6">
				<button
					title="yes"
					class="rounded opacity-80 hover:opacity-100 md:px-1 bg-transparent border-none active:animate-tada animate-duration-75 dark:color-white"
					onClick={() => {
						setTheme(theme() === "dark" ? "light" : "dark");
					}}
				>
					{/* {theme() === "light" ? <BsSunFill /> : <BsMoonFill />}
					 */}
					<Show when={() => theme() === "light"}>
						<BsSunFill />
					</Show>
					<Show when={() => theme() === "dark"}>
						<BsMoonFill />
					</Show>
				</button>
			</div>
		</div>
	);
};
