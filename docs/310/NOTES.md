# 310 sim

Original plan is to use the definition to create the dashboard. This is working, but highlights a few issues with the design of the state.
Mainly I want to divide the UI-creation from the UI-update. And the core definition is fine for the creation, but is overkill for updates.

Take the network diagram. The locations and colrs of the nodes does not change. Only the UI that represents the status of ops or the SOH of stores. So all the state needs to hold is `op.id, op.status` and `store.id, store.qty`. Which means we could use objects to map id to value. `:)`
So: `state: { opStatusMap: {}, storeQtyMap: {} }` perhaps?

Likewise with the Orders display. Only the Delivered (qty) value changes, and that isn't even a part of the orders definition. And the Mac display only cares about allocated ops and status, neither of which appear in the mac definitions.

So maybe we need a generic way to initialize the relevant state from the original definitions.

## V2
Take the convention that on creation, each store, resource or order produces a "UI" object that holds its id, a DOM element and an update function. The element needs to be added to the DOM externally, and is responsible for all UI representation of the relevant node.

Now the code can subscribe to the store in order to manage updates.
So I have moved the RM purchasing section to its own file, to declutter resources.js.

## V3
Implemented an efficient priority queue, so each user action can "schedule" a task in the simulated future. Examples:
* allocating an operation to a resource: TASK = complete setup in time + res.setup.
* operation commences processing: TASK = update fedby stock in time + op.runtime.
* allocation changes: edit relevant TASK instances to be ignored??

So we need a way to check if an operation is okay to proceed. Does it have a resource allocated? Is the resource in a ready state? Is there fedby stock?
May be simpler to check resources instead: in ready state, has op allocated? Does op have fedby stock?
Do the `hasFedByStock(opId)` function first.

Also maybe make things simpler by not allowing setups or operations to be broken.

