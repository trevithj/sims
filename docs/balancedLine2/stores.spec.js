import { describe, it } from "vitest";
import assert from 'node:assert/strict';
import {makeStore, NS} from './newStore.js';
import {subscribe} from '../pubsub.js';

function checkSubscribe(event, test, done) {
    const unsubscribe = subscribe(event, d => {
        test(d);
        unsubscribe();
        done();
    })
}

describe("New makeStore", () => {
    const opts = {id:123, soh:3, x:250, y:399 };
    
    it("should create an SVG element as expected", () => {
        const store = makeStore(opts);
        const test = store.parent;
        assert.equal(test.getAttribute("namespace"), NS.SVG);
        assert.equal(test.getAttribute("id"), "123");
        assert.equal(test.getAttribute("style"), "transform:translate(250px, 399px);");
        assert.equal(test.getAttribute("style"), "transform:translate(250px, 399px);");
    });
    
    it("should update SOH", () => {
        const store = makeStore(opts);
        return new Promise(done => {
            checkSubscribe("STOCK_CHANGED", d => {
                assert.equal(d.id, 123);
                assert.equal(d.soh, 1);
                assert.equal(d.delta, -2);
                assert.equal(store.soh, 1);
            }, done)
            assert.equal(store.soh, 3);
            store.soh -= 2;
        })
    });
})
