import { describe, it, expect } from "vitest";
import {simQueue, simTimer} from "./simHelpers.js";

describe("simQueue", () => {
    it("should return an object", () => {
        const queue = simQueue();
        expect(typeof queue).toBe("object");
        expect(typeof queue.pop).toBe("function");
        expect(typeof queue.add).toBe("function");
        expect(typeof queue.size).toBe("function");

        const theString = queue.toString();
        expect(theString).toBe("[]");
        expect(queue.size()).toBe(0);
    });
    
    it("should pop the correct values", () => {
        const queue = simQueue();
        
        queue.add(123, "anything");
        queue.add(124, "X");
        queue.add(125, "Y");
        expect(queue.size()).toBe(3);
        
        let result = queue.pop(121);
        expect(result).toEqual([]);
        
        result = queue.pop(123);
        expect(result).toEqual(["anything"]);
        expect(queue.size()).toBe(2);
        
        result = queue.pop(126);
        expect(result).toEqual(["X", "Y"]);
        expect(queue.size()).toBe(0);
    });
});

describe("simTimer", () => {
    it("should initialise as expected", () => {
        const timer = simTimer();
        expect(typeof timer.setTimeout).toBe("function");
        expect(typeof timer.clearTimeout).toBe("function");
        expect(timer.time).toBe(0);
        expect(() => {
            timer.time = -10;
        }).toThrow("Can't set time backwards");

        timer.time = 10;

        expect(() => {
            timer.time = 5;
        }).toThrow("Can't set time backwards");
    })

    it("should run timeout as expected", () => {
        let flag = 1;
        const cb = () => flag += 2;
        const timer = simTimer();

        timer.setTimeout(cb, 10);
        timer.setTimeout(cb, 12);
        expect(flag).toBe(1);

        timer.time = 10;
        expect(flag).toBe(3);

        timer.time = 20;
        expect(flag).toBe(5);
    })

    it("should allow timeout to be cancelled", () => {
        let flag = 1;
        const cb = () => flag = 2;
        const timer = simTimer();

        const id = timer.setTimeout(cb, 10);
        expect(flag).toBe(1);

        timer.clearTimeout(id);
        timer.time = 10;
        expect(flag).toBe(1);
    })
})