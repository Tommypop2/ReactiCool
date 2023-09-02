import S from "s-js";
export const bench = (updates: number) => {
	const data = S.data(0);
	const B = S(() => data());
	const C = S(() => B());
	const D = S(() => C());
	for (let i = 0; i < updates; i++) {
		data(i);
		D();
	}
};
