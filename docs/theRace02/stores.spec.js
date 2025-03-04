import { describe, it, expect } from "vitest";
import assert from 'node:assert/strict';
import {makeStore} from "./stores.js";
import {subscribe} from '../pubsub.js';

describe("makeStore fn", () => {
    it("should update as expected", () =>  {
        const store = makeStore("s1", {qty: 10, x:123});
        assert.equal(store.qty, 10); // Initial test value
        assert.equal(store.x, 123); // Holds any passed-in values

        store.update(3);
        return new Promise(done => {
            const unsubscribe = subscribe("StoreUpdated", (d) => {
                assert.equal(d.storeId,"s1");
                assert.equal(d.qty, 13);
                unsubscribe(); // stop other tests from running this.
                done();
            })
        })
    });
    
    it("should update with negative deltas too", () => new Promise(done => {
        const store = makeStore("s2", {qty: 10});
        
        store.update(-6);
        const unsubscribe = subscribe("StoreUpdated", function(d) {
            assert.equal(d.storeId,"s2");
            assert.equal(d.qty, 4);
            unsubscribe();
            done();
        })
    }));

    it("should throw if qty goes negative", function() {
        const store = makeStore("rm", {qty: 0 });
        assert.throws(() => {
            store.update(-1);
        }, Error("Qty cannot be negative"));
        assert.equal(store.qty, 0);
    });
});
