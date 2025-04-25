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

TODO: move the RM purchasing section somewhere else - declutter resources.js.
