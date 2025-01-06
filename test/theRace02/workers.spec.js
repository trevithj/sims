import assert from 'node:assert/strict';
import {makeWorker} from "../../docs/theRace02/workers.js";
import {publish} from '../../docs/pubsub.js';

// Mock for node tests
const elementMock = () => {
    const attributes = new Map();
    attributes.set("cx", 0);
    const classes = new Set();
    return {
        attributes,
        classes,
        getAttribute: key => attributes.get(key),
        setAttribute: (key, value) => attributes.set(key, value),
        addEventListener: () => null,
        classList: {
            add: name => classes.add(name),
            remove: name => classes.delete(name),
            contains: name => classes.has(name)
        }
    }
}

describe("makeWorker fn", () => {
    it("should update as expected", function() {
        const element = elementMock();
        const worker = makeWorker("w1", element);
        assert.equal(worker.workerId, "w1"); // Initial test value
        assert.equal(worker.cx, 0);
        worker.cx = 5;
        assert.equal(worker.cx, 5);
        assert.equal(element.attributes.get("cx"), 5);
        
        worker.setStatus("busy");
        assert(element.classes.has("busy"));
    });
    
    it("should respond to Reallocation event", function() {
        const element = elementMock();
        const worker = makeWorker("w2", element);
        worker.setStatus("busy");
        assert(element.classes.has("busy"));
        assert.equal(worker.cx, 0);
        
        publish("WorkerReallocated", { workerId: "w2"}, true);

        assert(!element.classes.has("busy"));
        assert.equal(worker.cx, "100");
    })

    it("should respond to SimFinished event", function() {
        const element = elementMock();
        const worker = makeWorker("w2", element);
        worker.setStatus("busy");
        assert(element.classes.has("busy"));
        
        publish("SimFinished", "test", true);

        assert(!element.classes.has("busy"));
    })
});
