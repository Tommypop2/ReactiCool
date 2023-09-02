import S from "s-js";

export default {
	name: "s-js",
	signal: <T>(initial: T) => {
		const data = S.data(initial);
		return [data, data] as const;
	},
	memo: <T>(fn: () => T) => {
		return S(fn);
	},
};
