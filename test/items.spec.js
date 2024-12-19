import assert from 'node:assert/strict';
import {subscribe} from '../docs/pubsub.js';
import {makeItem} from '../docs/theRace02/items.js';

describe('makeItem', () => {
    it('should create valid item object', () => {
        const item = makeItem("ra");
        assert.equal(item.itemId, "ra");
        assert.equal(typeof item.animation.play, "function");
        assert.equal(typeof item.animation.pause, "function");
    });

    it("should stop animation when worker is deallocated");
    it("should publish event when animation is complete");
});
