import { describe, test, expect } from "vitest";
import assert from 'node:assert/strict';
import {subscribe} from '../pubsub.js';
import {makeItem} from './items.js';

describe('makeItem', () => {
    subscribe("MOCK", text => {
        console.log("Mock", text);
    })
    test('should create valid item object', () => {
        const item = makeItem("ra");
        assert.equal(item.itemId, "ra");
        assert.equal(typeof item.animation.play, "function");
        assert.equal(typeof item.animation.pause, "function");
    });

    test.skip("should stop animation when worker is deallocated");
    test.skip("should publish event when animation is complete");
});
