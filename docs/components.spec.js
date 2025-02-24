import { describe, it } from "vitest";
import assert from 'node:assert/strict';
import {makeNSElement, NS} from './components.js';

describe("Component helpers", () => {
    const makeEl = makeNSElement(NS.SVG);
    it("should create an NS element as expected", () => {
        const result = makeEl("g", {x:5, y:10});
        const test = result.vals;
        assert.equal(test.get("x"), "5");
        assert.equal(test.get("y"), "10");
        assert.equal(test.get("namespace"), NS.SVG);
    });
})
