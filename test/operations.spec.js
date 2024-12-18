import assert from 'node:assert/strict';
import {makeOp} from '../docs/theRace02/operations.js';
import {publish} from '../docs/pubsub.js';

const getWorker = (workerId) => ({ workerId, setStatus: () => null });
const getStore = (storeId) => ({ storeId, qty: 10 });

describe("makeOp", function() {
    it("should create the expected object", function(){
        const theOp = makeOp("op-ra", {getWorker, getStore});
        assert.equal(typeof theOp.getStock, "function");
        assert.equal(typeof theOp.putStock, "function");
        
        assert.equal(theOp.getStock(99), 0, "Taking more than stock is holding");
        assert.equal(theOp.getStock(2), 2, "Not getting stock");
        
        assert.equal(theOp.status,"IDLE","Wrong initial status");
        publish("WorkerAllocated", {workerId: "r1", newOpId: "op-ra" }, true);
        assert.equal(theOp.status,"SETUP");
        publish("SetupDone", {workerId: "r1", opId: "op-ra" }, true);
        assert.equal(theOp.status,"READY");
        publish("WorkerAllocated", {workerId: "r1", oldOpId: "op-ra" }, true);
        assert.equal(theOp.status,"IDLE");
    })
});

/*
IDLE
  worker-allocated -> SETUP
SETUP
  setup-done -> READY
READY
  no-stock -> WAITING
  stock-taken -> RUNNING
RUNNING
  op-done -> READY
WAITING
  stock-received -> READY

*/


