import {describe, it, expect, beforeEach} from "vitest";
import {makePriorityQueue, simMapQueue, simQueue, simTimer} from "./simHelpers.js";

function doTime(callback, name = "") {
    const now = performance.now();
    callback();
    console.log(name, performance.now() - now);
}

describe("simQueue", () => {
    it("should return an object", () => {
        doTime(() => {
            const queue = simQueue();
            expect(typeof queue).toBe("object");
            expect(typeof queue.pop).toBe("function");
            expect(typeof queue.add).toBe("function");
            expect(typeof queue.size).toBe("function");

            const theString = queue.toString();
            expect(theString).toBe("[]");
            expect(queue.size()).toBe(0);
        }, "simQueue1");
    });

    it("should pop the correct values", () => {
        doTime(() => {
            const queue = simQueue();
            queue.add(123, "anything");
            queue.add(124, "X");
            queue.add(125, "Y");
            expect(queue.size()).toBe(3);
            console.log(queue.toString())

            let result = queue.pop(121);
            expect(result).toEqual([]);

            result = queue.pop(123);
            expect(result).toEqual(["anything"]);
            expect(queue.size()).toBe(2);

            result = queue.pop(126);
            expect(result).toEqual(["X", "Y"]);
            expect(queue.size()).toBe(0);
        }, "simQueue2")
    });
});

describe("simMapQueue", () => {
    it("should return an object", () => {
        const queue = simMapQueue();
        const theString = queue.toString();
        expect(theString).toBe("[]");
        expect(queue.size()).toBe(0);
    });

    it("should pop the correct values", () => {
        doTime(() => {
            const queue = simMapQueue();
            queue.add(123, "anything");
            queue.add(124, "X");
            queue.add(126, "Y");
            queue.add(126, "Z");
            expect(queue.size()).toBe(4);
            expect(queue.keys()).toEqual([123, 124, 126]);

            let result = queue.pop(121);
            expect(result).toEqual([]);

            result = queue.pop(123);
            expect(result).toEqual(["anything"]);
            expect(queue.size()).toBe(3);

            result = queue.pop(126);
            expect(result).toEqual(["Y", "Z"]);
            expect(queue.size()).toBe(1);
            expect(queue.keys()).toEqual([124]);
        }, "simMapQueue2")
    });
});

describe("makePriorityQueue", () => {
    let queue;

    function getLog(q) {
        const log = [];
        q.traverse((v, p) => log.push(`${v}:${p}`));
        return log;
    }

    beforeEach(() => {
        queue = makePriorityQueue();
        queue.enqueue("XYZ", 10);
        queue.enqueue("ABC", 1);
        queue.enqueue("MID", 3);
    });
    
    it("should transverse in priority order", () => {
        doTime(() => {
            const log = [];
            queue.traverse((v, p) => {
                log.push(`${v}:${p}`);
            });
            expect(log).toEqual([
                "ABC:1",
                "MID:3",
                "XYZ:10"
            ]);
        }, "priorityQueue1")
    });
    
    it("should remove matching items", () => {
        doTime(() => {
            queue.enqueue("LEFT", 4);
            expect(queue.peek()).toBe("ABC");
            
            queue.remove((v, p) => {
                return p !== 4;
            });
            expect(getLog(queue)).toEqual([
                "LEFT:4"
            ])
        }, "priorityQueue-remove");
        // ensure empty queue doesn't error
        const q2 = makePriorityQueue();
        q2.remove(() => true);
    });

    it("should peek and dequeue next value by priority", () => {
        doTime(() => {
            expect(queue.peek()).toBe("ABC");
            expect(queue.peekPriority()).toBe(1);
            const next = queue.dequeue();
            expect(next).toBe("ABC");
            expect(queue.peek()).toBe("MID");
            expect(queue.peekPriority()).toBe(3);

            queue.enqueue("ABC", 1);
            expect(queue.peek()).toBe("ABC");
            expect(queue.peekPriority()).toBe(1);
        }, "priorityQueue2")
    })

    it("should support dequeueing all matching priorities", () => {
        doTime(() => {
            queue.enqueue("MIE", 3);
            queue.enqueue("MIF", 3);
            let log = getLog(queue);
            expect(log).toEqual([
                "ABC:1",
                "MID:3",
                "MIE:3",
                "MIF:3",
                "XYZ:10"
            ]);
            // dequeue loop for priority < 5
            while (queue.peekPriority() < 5) {
                queue.dequeue();
            }
            log = getLog(queue);
            expect(log).toEqual(["XYZ:10"]);

        }, "priorityQueue2")
    })
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