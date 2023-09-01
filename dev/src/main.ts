import { COMPUTATIONS, Computation } from "../../src/core";

const { read, write } = new Computation(() => 1);
const A = read;
const B = new Computation(() => read() + 1).read;
const C = new Computation(() => B() + 2).read;
const D = new Computation(() => {
	console.log("Updating");
	return B() + C();
}).read;

console.log(D());

write(2);

console.log(D());

console.log(COMPUTATIONS);