import {createStore} from "zustand/vanilla";
import {data, macColors, info} from "./definition.js";

function makeIdMap(data) {
    const { orders, stores, ops, macs } = data;
    const map = new Map();
    orders.forEach(d => map.set(d.id, d));
    stores.forEach(d => map.set(d.id, d));
    macs.forEach(d => map.set(d.id, d));
    ops.forEach(d => map.set(d.id, d));
    return map;
}

function clamp(min, max) {
    return value => Math.min(Math.max(value, min), max);
}



const clampSpeed = clamp(0, 20);

export const theManager = createStore((set, get) => {
    return {
        ...data,
        macColors,
        ...info,
        idMap: makeIdMap(data),
        actions: {
            setSpeed: delta => {
                set(state => {
                    const speed = clampSpeed(state.speed + delta);
                    return { speed };
                });
            },
            // TODO: more than just update time?
            nextStep: () => set(state => ({ time: state.time + 1 })),
            getById: id => get().idMap.get(id) || null,
            dispatch: (type, payload) => console.log(type, payload),
        },
    };
});

// export const getOp