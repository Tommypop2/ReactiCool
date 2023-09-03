import { A } from "@reacticool/router";
type NavbarProps = {
	routes: { name: string; href: string }[];
};
export const Navbar = (props: NavbarProps) => {
	return (
		<div class="h-10 w-full flex flex-row gap-2 m-0 p-0">
			{props.routes.map((r) => (
				<A
					href={r.href}
					class="inline-flex items-center m-0 px-5 py-3 rounded-t-1 no-underline text-lg"
				>
					{r.name}
				</A>
			))}
		</div>
	);
};
