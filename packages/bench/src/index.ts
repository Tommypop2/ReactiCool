import cli from "./cli-reactivity";
import reactively from "./reactively";
import sjs from "./s-reactivity";
import solidjs from "./solid-reactivity";
import reacticool from "./this-reactivity";
import vueReactivity from "./vue-reactivity";
const BENCHMARKS = [reacticool, sjs, cli, reactively, solidjs, vueReactivity];
type Reactivity = (typeof BENCHMARKS)[number];
const bench = (reactivity: Reactivity) => {
	const [get, set] = reactivity.signal(0);
	const B = reactivity.memo(() => get());
	const C = reactivity.memo(() => B());
	const D = reactivity.memo(() => C());
	for (let i = 0; i < 100000; i++) {
		set(i);
		D();
	}
};
const benchBatched = (reactivity: Reactivity) => {
	const [get, set] = reactivity.signal(0);
	const B = reactivity.memo(() => get());
	const C = reactivity.memo(() => B());
	const D = reactivity.memo(() => C());
	reactivity.batch(() => {
		for (let i = 0; i < 100000; i++) {
			set(i);
		}
	});
	D();
};
const benchAll = () => {
	// Prevent any libraries from using console.warn
	globalThis.console.warn = () => {};
	console.log("Benching");
	for (const benchmark of BENCHMARKS) {
		const start = performance.now();
		bench(benchmark);
		const end = performance.now();
		console.log(`${benchmark.name}: ${end - start}ms`);
	}
	console.log("--------");
	console.log("Benching batched");
	for (const benchmark of BENCHMARKS) {
		try {
			const start = performance.now();
			benchBatched(benchmark);
			const end = performance.now();
			console.log(`${benchmark.name}: ${end - start}ms`);
		} catch {}
	}
};
benchAll();
