import { describe, it, expect, vi } from "vitest";
import makeStock from "./stock";
import {subscribe} from "../pubsub";

describe("Stock", () => {
    const stock = makeStock("test", {max:25, soh:10});
    
    it("should update as expected", () => {
        expect(stock.soh).toBe(10);

        const sub1 = vi.fn();
        subscribe("STOCK_INCREASED", sub1);
        const sub2 = vi.fn();
        subscribe("STOCK_DECREASED", sub2);

        stock.give(2);
        expect(stock.soh).toBe(12);

        stock.take(1);
        stock.take(1);
        expect(stock.soh).toBe(10);

        return new Promise(done => {
            setTimeout(() => {
                expect(sub1).toHaveBeenCalledTimes(1);
                expect(sub1).toHaveBeenCalledWith({ id: 'test', soh: 12, qty: 2 });

                expect(sub2).toHaveBeenCalledTimes(2);
                expect(sub2).toHaveBeenLastCalledWith({ id: 'test', soh: 10, qty: 1 });
                done();
            }, 1)
        });
    })
})