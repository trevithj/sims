## Dev notes

Code should be refactored so each simulator can run with its own context. This enables many sims to be set up and configured easily on the page.
Each sim requires parameters to define how many units per tick an op can do. This should be via a function that takes the tick # and returns the number of units.
The nextState fn needs access to the ops values too. So maybe we need a nextOps function.

New approach: store raw material (rm) separately. That way, each op feeds a store. So ops and stores can be the same size. Only need a rule for the first op to take from rm, and not the preceeding store.
Only complication: when calculating, each op except the first needs to check the new process value is not larger than the preceeding store. The first op checks against rm. One way to do this is to create a temp store (st) that effectively adds the rm to the beginning of the array of stores, and excludes the final store. That way, the index of the st will match the op that takes from it.
