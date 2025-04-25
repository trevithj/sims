import { describe, it, expect } from "vitest";
import {makeWorker} from "./workers.js";
import {publish} from '../common/pubsub.js';

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
        expect(worker.workerId).toBe("w1"); // Initial test value
        expect(worker.cx).toBe(0);
        worker.cx = 5;
        expect(worker.cx).toBe(5);
        expect(element.attributes.get("cx")).toBe(5);
        
        worker.setStatus("busy");
        expect(element.classes.has("busy")).toBe(true);
    });
    
    it("should respond to Reallocation event", function() {
        const element = elementMock();
        const worker = makeWorker("w2", element);
        worker.setStatus("busy");
        expect(element.classes.has("busy")).toBe(true);
        expect(worker.cx).toBe(0);
        
        publish("WorkerReallocated", { workerId: "w2"}, true);

        expect(element.classes.has("busy")).toBe(false);
        expect(worker.cx).toBe("100");
    })

    it("should respond to SimFinished event", function() {
        const element = elementMock();
        const worker = makeWorker("w2", element);
        worker.setStatus("busy");
        expect(element.classes.has("busy")).toBe(true);
        
        publish("SimFinished", "test", true);

        expect(element.classes.has("busy")).toBe(false);
    })
});
