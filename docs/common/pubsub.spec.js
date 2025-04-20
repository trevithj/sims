import { describe, it, expect } from "vitest";
import {publish, subscribe} from "./pubsub";

describe("Publish", () => {
    const message = { abc: Math.random() };
    const eventName = `Event:${Math.random()}`;

    it("should publish expected message after current thread has completed", () => {
        let subscriberWasCalled = false;
        const testFn = evt => {
            expect(evt).toBe(message);
            subscriberWasCalled = true;
        }
        subscribe(eventName, testFn);
        publish(eventName, message);
        expect(subscriberWasCalled).toBe(false);
        setTimeout(() => {
            expect(subscriberWasCalled).toBe(true);
        }, 1);
    });

    it("should publish immediately if needed", () => {
        let time = 0;
        const testFn = () => {
            time = Date.now();
        }
        subscribe(eventName, testFn);
        expect(time).toBe(0);
        publish(eventName, message, true);
        expect(time).not.toBe(0);
        expect(time).toBeLessThanOrEqual(Date.now());
    });

    it("should handle multiple subscribers", () => {
        let count = 0;
        const testFn = () => {
            count += 1;
        }
        subscribe(eventName, testFn);
        subscribe(eventName, testFn);
        subscribe(eventName, testFn);
        subscribe(eventName, "Ignore something that is not a function");
        subscribe(eventName, () => {
            throw new Error("Fail gracefully");
        });
        expect(count).toBe(0);
        publish(eventName, message, true);
        expect(count).toBe(3);
    });
})

describe("Subscribe", () => {
    const eventName = `Event:${Math.random()}`;

    it("should unsubscribe", () => {
        let count = 0;
        const testFn = () => {
            count += 1;
        }
        const unsubscribe = subscribe(eventName, testFn);
        expect(count).toBe(0);
        publish(eventName, null, true);
        publish(eventName, null, true);
        expect(count).toBe(2);
        unsubscribe();
        publish(eventName, null, true);
        publish(eventName, null, true);
        expect(count).toBe(2);
    });
})
