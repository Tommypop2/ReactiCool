import S from "s-js";
export const bench = (updates: number) => {
	const A = S.data(0);
	for (let i = 0; i < updates; i++) {
		A(i);
	}
};
