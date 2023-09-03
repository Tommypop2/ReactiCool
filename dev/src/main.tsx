import { render } from "../../dist/array-based-reactive";
import "./main.css";
import "virtual:uno.css";
export default function Home() {
	return (
		<div class={`h-full w-full dark font-[source-sans]`}>
			<div class="h-full w-full dark:bg-dark dark:text-light transition-colors">
				<main class="w-full h-full">
					<div class="w-full flex flex-row justify-center h-full sm:items-center <sm:text-center">
						<div class="sm:hover:animate-head-shake">
							<h1
								class={`clip-text text-9xl <sm:text-8xl select-none animate-gradient bg-gradient relative z-2`}
							>
								Very Cool
							</h1>
						</div>
					</div>
					<div class="absolute right-1 bottom-1 <sm:flex <sm:flex-row <sm:items-center <sm:justify-center <sm:w-full <sm:bottom-16 <sm:right-0">
						<div
							class="absolute w-full h-full z-[0] animate-pulse animate-duration-[5s] hover:animate-paused"
							style={{
								"background-image":
									"linear-gradient(-120deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
								"border-radius": "50%",
								filter: "blur(120px)",
								transform: "translate(-50%,-50%)",
								top: "50%",
								left: "50%",
							}}
						/>
					</div>
				</main>
			</div>
		</div>
	);
}
render(Home, document.getElementById("app"));
