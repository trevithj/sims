// import assert from 'node:assert';
import assert from 'node:assert/strict';
import {simQueue} from "./simHelpers.js";

function toStr(any) {
    return JSON.stringify(any);
}

describe("simQueue", function() {
    it("should return an object", function() {
        const queue = simQueue();
        assert.ok(typeof queue === "object", "Expected an object");
        assert.ok(typeof queue.pop === "function", "Expected: 'pop' method");
        assert.ok(typeof queue.add === "function", "Expected: 'add' method");

        const theString = queue.toString();
        assert.equal(theString, "[]", "Expected: is stringable");
    });

    it("should pop the correct values", function() {
        const queue = simQueue();
  
        queue.add(123, "anything");
        queue.add(124, "X");
        queue.add(125, "Y");
        console.log(queue.toString());
        
        let result = queue.pop(121);
        assert.equal(toStr(result), "[]", "Expect empty array");
        
        result = queue.pop(123);
        assert.equal(toStr(result), "[\"anything\"]", "Expect populated array");
        console.log(queue.toString());
        
        result = queue.pop(126);
        assert.equal(toStr(result), "[\"X\",\"Y\"]", "Expect populated array");
        console.log(queue.toString());
    });
});
