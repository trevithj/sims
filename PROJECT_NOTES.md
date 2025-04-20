# Designs and Thoughts

- Parallel vs Concurrent processing
- Resource utilisation vs work flow
- Serial vs Sequential
- Dependent and Independent tasks
- Types of dependencies (are there really independent tasks in a single system?)

-------------
Checking: 3 dependent tasks that form a sequential workflow. Each task has a 10% chance of being delayed. So over 1000 runs how many runs:
```
have no delay on tasks? 9 * 9 * 9 = 729
have task 1 delay only? 1 * 9 * 9 = 81
have task 2 delay only? 9 * 1 * 9 = 81
have task 3 delay only? 9 * 9 * 1 = 81
have tasks 1 & 2 delay? 1 * 1 * 9 = 9
have tasks 2 & 3 delay? 1 * 1 * 9 = 9
have tasks 1 & 3 delay? 1 * 1 * 9 = 9
have all 3 tasks delay? 1 * 1 * 1 = 1
```

## Time slicing of sims
Time per unit of work, or units of work per time?
First for discrete sims, second for more aggregated flows.
Either way, need to work out throughput at each time step. This means using the stock values at (t) to work out the values at (t+1).
So how do we store the values of (t) and (t+1)? And do we need to hold the entire history? Why not? The sims aren't that big.

What form does the update function for the ToC sims take?: `(oldNetwork, userInput) => newNetwork`.

## What to simulate
Hmm. How about another approach that simulates the work units, rather than the resources. Maybe a simple job-shop, where all work goes through the same steps, with dedicated resources for each step (A -> B -> C etc) but the difference is in how long each step takes for a given job. User has to figure a manual schedule of a given list of orders with relevant due-dates. Example:
```
Order   due qty tm-A    tm-B    tm-C
1234    102 120 0010    0020    0010
1235    110 100 0010    0001    0001
1236    110 500 0001    0005    0005
1237    120 150 0005    0005    0005
1238    121 100 0007    0003    0010
```
Maybe this can be simplified: qty=1 in all cases, so batching isn't a complication. But multiple orders can be worked on concurrently.
Schedules would be for each resource like this:
```
Order   Task    Time    Start   Finish
1234    A.34    0010    0042    0052
1234    B.34    0020    0053    0073
1234    C.34    0010    0090    0100 // slack here?
```

How do we animate this? Or DO we animate it?
Forget an animated sim for a minute, think of how to illustrate it clearly. What do we want to convey here?
In a perfect setup, there may be no way to get the orders delivered on time, and also avoid idle time on resources. The priorities are in direct conflict.
So we need to report the result of a schedule as:
- a Gantt-like chart showing resource loading
- a KPI on utilisation of each resource
- a KPI on late deliveries, or holding costs
- a measure related to ... global efficiency? Measured how? Maybe two scenarios that demonstrate optimum for each of the KPIs.

## Ideas
### A circular queue.
Compare two animated circular queues of stores and flows, same configuration.
Each has a process that takes from one store, animates some sort of movement, then puts into the next store in the circle. The flow stops if there is no stock to take. Adding stock to a store will trigger a halted flow.

The difference is in the duration of each animation. The first will use a constant time, the second will use the same average time give or take `x`. Make `x` variable, and see how the flow unfolds.
