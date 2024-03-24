import {
	type Getter,
	type JSX,
	ParentProps,
	createMemo,
	createSignal,
} from "@reacticool/web";
type ForProps<T extends readonly any[], U extends JSX.Element> = {
	each: T | undefined | null | false;
	children: (item: T[number], index: Getter<number>) => U;
};
const For = <T extends readonly any[], U extends JSX.Element>(
	props: ForProps<T, U>,
) => {
	const children = props.children;
	const each = props.each;
	if (!each) return <></>;
	return createMemo(
		() => each.map((e) => children(e, () => 1)) as any,
	) as unknown as JSX.Element;
};
const bubbleSort = (arr: number[]) => {
	const steps = [];
	steps.push(structuredClone(arr));
	while (true) {
		let swaps = 0;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] > arr[i + 1]) {
				const temp = arr[i];
				arr[i] = arr[i + 1];
				arr[i + 1] = temp;
				swaps++;
				steps.push(structuredClone(arr));
			}
		}
		if (swaps === 0) {
			break;
		}
	}
	return steps;
};
export const Tests = () => {
	// Weird bug with DOM nodes below
	const arr = [125, 2351, 6342, 215672, 124981, 236];
	const [displayedElems, setDisplayedElems] = createSignal(
		structuredClone(arr),
	);
	const steps = bubbleSort(arr);
	let ind = 0;
	setInterval(() => {
		setDisplayedElems(steps[ind]);
		ind++;
	}, 2000);
	return (
		<>
			<For each={displayedElems()}>
				{(a, b) => {
					return <div>{a}</div>;
				}}
			</For>
		</>
	);
};
export default Tests;
