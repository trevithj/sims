# New sim 2

Similar sort of app to the race01, but here I want to experiment with a more OO approach to sim control. To try: get an object to know about the relevant DOM elements related to a single operation, and so control the animations for moving an item and updating the stocks.

Object code will need to:
- check that a feed stock has enough qty for the op.
- reduce feed qty and trigger the item animation.
- listen to the item animation finish and update fedto qty.
- monitor changes in feed stock level.

## State charts:
### Main
INIT
  click-start -> RUNNING
RUNNING
  tick -> RUNNING
  no-cash -> FAILED
  time-up -> DONE

### Store
QTY
  rm-purchased-ok -> QTY
  stock-taken -> QTY
  stock-received -> QTY
  fg-completed -> QTY

### Op
IDLE
  worker-allocated -> SETUP
SETUP
  timeout -> READY
READY
  no-stock -> WAITING
  stock-taken -> RUNNING
RUNNING
  done -> READY
WAITING
  stock-received -> READY

## TODOS
[x] get a spec file to run assertions in `node` against browser-side code. Mod code inline to return testable mocks when referencing any broser-specific behavious (eg, `querySelector`, `document` etc))
[x] move to greater use of publish/subscribe, for easier testing.
[x] add a high-level event-component design.

## Events
### Output
Emits:
- SimFinished
Receives:
- StoreUpdated

### Items
Emits:
- OpProcessDone
Receives:
- OpProcessStarted (todo)
- OpDeallocated (todo)
- SimFinished

### Main
Emits:
- InitDone
- WorkerReallocated
- SetupDone
- SimStarted
Receives:
- SimFinished
- InitDone

### Operations
Emits
- OpDeallocated
- OpProcessStared
Receives:
- WorkerReallocated
- OpProcessDone
- SetupDone
- StoreUpdated
- SimStarted

### Store
Emits:
- StoreUpdated (in response to `store.update()` invokation.

### Worker:
Receives:
- WorkerReallocated
- SimFinished

