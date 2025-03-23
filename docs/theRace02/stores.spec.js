import { describe, it, expect } from "vitest";
import {makeStore} from "./stores.js";
import {subscribe} from '../pubsub.js';

describe("makeStore fn", () => {
    it("should update as expected", () =>  {
        const store = makeStore("s1", {qty: 10, x:123});
        expect(store.qty).toBe(10); // Initial test value
        expect(store.x).toBe(123); // Holds any passed-in values

        store.update(3);
        return new Promise(done => {
            const unsubscribe = subscribe("StoreUpdated", (d) => {
                expect(d.storeId).toBe("s1");
                expect(d.qty).toBe(13);
                unsubscribe(); // stop other tests from running this.
                done();
            })
        })
    });
    
    it("should update with negative deltas too", () => new Promise(done => {
        const store = makeStore("s2", {qty: 10});
        
        store.update(-6);
        const unsubscribe = subscribe("StoreUpdated", function(d) {
            expect(d.storeId).toBe("s2");
            expect(d.qty).toBe(4);
            unsubscribe();
            done();
        })
    }));

    it("should throw if qty goes negative", function() {
        const store = makeStore("rm", {qty: 0 });
        expect(() => {
            store.update(-1);
        }).toThrow("Qty cannot be negative");
        expect(store.qty).toBe(0);
    });
});
