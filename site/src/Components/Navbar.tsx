import { A } from "@reacticool/router";
export const Navbar = () => {
	return (
		<div class="h-10 w-full flex flex-row gap-2 m-0 p-0">
			<A
				href="/"
				class="inline-flex items-center m-0 px-5 py-3 rounded-t-1 no-underline text-lg"
			>
				Home
			</A>
			<A
				href="/about"
				class="inline-flex items-center m-0 px-5 py-3 rounded-t-1 no-underline text-lg"
			>
				About
			</A>
		</div>
	);
};
