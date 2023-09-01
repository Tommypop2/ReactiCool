# ReactiCool

A reactive library that takes a fundamentally different approach to updates

## The approach

Instead of building up a complex graph of nodes, like most reactive libraries, this library flattens the graph into a one dimensional array, whose order is equivalent to the update order.

This means we can eliminate expensive graph traversals and recursion from our update cycle. Instead we just iterate over the array until the last dependent node is reached. Effectively, the cost is moved from update to creation, as that's when the update order is determined
