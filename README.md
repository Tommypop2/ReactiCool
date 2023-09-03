# ReactiCool

A reactive library that takes a fundamentally different approach to updates.

## The approach

Instead of building up a complex graph of nodes, like most reactive libraries, this library flattens the graph into a one dimensional array, whose order is equivalent to the update order.

This means we can eliminate expensive graph traversals and recursion from our update cycle. Instead we just iterate over the array until the last dependent node is reached. Effectively, the cost is moved from update to creation, as that's when the update order is determined.

Take this example:

```ts
const [get, set] = createSignal(0);
const derived = createMemo(() => get() * 2);
const further_derived = createMemo(() => derived() * 2);
```

## Other libraries

In most reactive libraries, when `createMemo` runs, it registers itself as the global listener and runs the computation passed to it.

When `get` is read, it tracks itself with that global listener - appending itself to the listener's dependencies, and adding the listener to its list of subscribers. Likewise, when `derived` is read within the `further_derived` memo, the same thing occurs.

When `set` is called, the graph must be traversed to update all the dirty computations. First, the signal iterates over its dependencies - calling update on each one. Then, those dependencies update their dependencies. Eventually, the graph is up to date.

Even this approach, with one graph traversal, is fairly slow, because of the indirection involved when traversing the graph (we access each node, which in turn has to access its child nodes, etc).

In order to properly update the graph, without overexecuting any computations, two traversals are usually required: one to mark the graph so it knows what to recompute and when, and another to actually update the nodes in the graph. This exacerbates the issue.

## This library

When `createMemo` runs, it sets a global `OBSERVED` variable to true, so any reads within it know that they're being observed.

When `get` is read, the computation which it points to (in this case, a signal), is pushed to a global `COMPUTATIONS` array, and the computation sets its `slot` variable to the index of itself within this array.

When `createMemo` finishes running, it pushes itself to the `COMPUTATIONS` array after all its dependencies.
After the above code, the `COMPUTATIONS` array ordering would be: `[count, derived, further_derived]`

This means that the optimal update order for the nodes is the order in which they appear in the array, so propagating an update to `count`, would be as simple as iterating over the array and updating subsequent nodes
