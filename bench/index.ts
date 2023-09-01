import { bench as cliBench } from "./cli-reactivity";
import { bench as thisBench } from "./this-reactivity";
import { bench as reactivelyBench } from "./reactively";
import { bench as sBench } from "./s-reactivity";
const bench = (benchFn: (updates: number) => any) => {
	const start = performance.now();
	benchFn(100000);
	const end = performance.now();
	return end - start;
};
const main = () => {
	const thisTime = bench(thisBench);
	const cliTime = bench(cliBench);
	const reactivelyTime = bench(reactivelyBench);
	const sJsTime = bench(sBench);
	console.log(`This: ${thisTime}ms`);
	console.log(`CLI: ${cliTime}ms`);
	console.log(`Reactively: ${reactivelyTime}ms`);
	console.log(`S.js: ${sJsTime}ms`);
};

main();
