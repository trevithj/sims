import { describe, it } from "vitest";
import assert from 'node:assert/strict';
import {simQueue, simTimer} from "./simHelpers.js";

function toStr(any) {
    return JSON.stringify(any);
}

describe("simQueue", () => {
    it("should return an object", () => {
        const queue = simQueue();
        assert.ok(typeof queue === "object", "Expected an object");
        assert.ok(typeof queue.pop === "function", "Expected: 'pop' method");
        assert.ok(typeof queue.add === "function", "Expected: 'add' method");
        assert.ok(typeof queue.size === "function", "Expected: 'size' method");

        const theString = queue.toString();
        assert.equal(theString, "[]", "Expected: is stringable");
        assert.equal(queue.size(), 0, "Expected: zero size");
    });

    it("should pop the correct values", () => {
        const queue = simQueue();
  
        queue.add(123, "anything");
        queue.add(124, "X");
        queue.add(125, "Y");
        assert.equal(queue.size(), 3, "Expect three items");
        
        let result = queue.pop(121);
        assert.equal(toStr(result), "[]", "Expect empty array");
        
        result = queue.pop(123);
        assert.equal(toStr(result), "[\"anything\"]", "Expect populated array");
        assert.equal(queue.size(), 2, "Expect two items");
        
        result = queue.pop(126);
        assert.equal(toStr(result), "[\"X\",\"Y\"]", "Expect populated array");
        assert.equal(queue.size(), 0, "Expect empty queue");
    });
});

describe("simTimer", () => {
    it("should initialise as expected", () => {
        const timer = simTimer();
        assert.equal(typeof timer.setTimeout, "function");
        assert.equal(typeof timer.clearTimeout, "function");
        assert.equal(timer.time, 0);
        assert.throws(() => {
            timer.time = -10;
        }, Error("Can't set time backwards"));

        timer.time = 10;

        assert.throws(() => {
            timer.time = 5;
        }, Error("Can't set time backwards"));
    })

    it("should run timeout as expected", () => {
        let flag = 1;
        const cb = () => flag += 2;
        const timer = simTimer();

        timer.setTimeout(cb, 10);
        timer.setTimeout(cb, 12);
        assert.equal(flag, 1);

        timer.time = 10;
        assert.equal(flag, 3);

        timer.time = 20;
        assert.equal(flag, 5);
    })

    it("should allow timeout to be cancelled", () => {
        let flag = 1;
        const cb = () => flag = 2;
        const timer = simTimer();

        const id = timer.setTimeout(cb, 10);
        assert.equal(flag, 1);

        timer.clearTimeout(id);
        timer.time = 10;
        assert.equal(flag, 1);
    })
})