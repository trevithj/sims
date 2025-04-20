import { describe, it, expect } from "vitest";
import { theManager } from "./stateManager.js";

describe('StateManager.getState', () => {
    const { getState } = theManager;
    it('should return expected default state', () => {
        const state = getState();
        expect(state.ops.length).toBe(19);
        expect(state.macs.length).toBe(8);
        expect(state.stores.length).toBe(23);
        expect(state.orders.length).toBe(3);

        expect(state.cash).toBe(11000);
        expect(state.time).toBe(0);
        expect(state.speed).toBe(0);
        // console.log(Object.keys(state));
    });

    it('should provide state update methods', () => {
        const { actions, time, speed } = getState();
        expect(actions).toBeDefined();
        expect(time).toBe(0);
        expect(speed).toBe(0);

        actions.setSpeed(12);
        expect(getState().speed).toBe(12);

        actions.setSpeed(999); // should clamp to 20
        expect(getState().speed).toBe(20);
        
        actions.nextStep();
        expect(getState().time).toBe(1);
    });

    it('should provide state finder methods', () => {
        const { actions, macs } = getState();
       
        // console.log(macs[3]);
        const none = actions.getById("unknown");
        const op = actions.getById("OP:A-5");
        const mac = actions.getById("MAC:B-2");
        const store = actions.getById("ST:A-7");
        // let op = actions.getById("unknown");
        expect(none).toBe(null);
        expect(op).not.toBe(null);
        expect(op.id).toBe("OP:A-5");
        expect(mac.id).toBe("MAC:B-2");
        expect(store.id).toBe("ST:A-7");
        
    });
});