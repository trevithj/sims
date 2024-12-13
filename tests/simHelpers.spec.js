// import assert from 'node:assert';
import assert from 'node:assert/strict';
import {simQueue} from "./simHelpers.js";
// import {watch} from 'node:fs';

function toStr(any) {
    return JSON.stringify(any);
}

function tests() {
    console.log(Date.now(), "------------");
    const queue = simQueue();
    assert.ok(typeof queue === "object", "Expected an object");

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

    console.log("--All tests passed--");
}

// Runner
tests();
// let fsWait = false;
// function listener(eventType) {
//     if (fsWait) return;
//     fsWait = setTimeout(() => {
//         fsWait = false;
//     }, 1000);
//     console.log(`event type is: ${eventType}`);
//     try {
//         tests();
//     } catch (err) {
//         console.log(err.message);
//     }
// };

// watch('../tests', listener);
