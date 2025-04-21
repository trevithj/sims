import {createStore} from "zustand/vanilla";
import * as DEFN from "./definition.js";

function makeIdMap(data) {
    const { orders, stores, ops, macs } = data;
    const map = new Map();
    orders.forEach(d => map.set(d.id, d));
    stores.forEach(d => map.set(d.id, d));
    macs.forEach(d => map.set(d.id, d));
    ops.forEach(d => map.set(d.id, d));
    return map;
}

function makeMap(items, selector) {
    const map = {};
    items.forEach(d => map[d.id] = selector(d));
    return map;
}

function clamp(min, max) {
    return value => Math.min(Math.max(value, min), max);
}



const clampSpeed = clamp(0, 20);

export const theManager = createStore((set) => {
    const idMap = makeIdMap(DEFN.data);
    const { ops, macs, stores, orders } = DEFN.data;
    const maps = {
        storeQty: makeMap(stores, s => s.qty),
        opStatus: makeMap(ops, () => "?"),
        macStatus: makeMap(macs, () => "idle"),
        macCurrentOp: makeMap(macs, () => null),
        ordersQty: makeMap(orders, () => 0),
    }

    const getById = id => idMap.get(id) || null;
    return {
        ...maps,
        ...DEFN.info,
        actions: {
            getById,
            getDefinition: () => DEFN,
            allocateOp: (macId, opId, lastOpId) => {
                set(state => {
                    const opStatus = {...state.opStatus, [lastOpId]:"?" };
                    const macStatus = {...state.macStatus, [macId]:"setup" };
                    const macCurrentOp = {...state.macCurrentOp, [macId]:opId };
                    return { macStatus, macCurrentOp, opStatus };
                });
            },
            setSpeed: delta => {
                set(state => {
                    const speed = clampSpeed(state.speed + delta);
                    return { speed };
                });
            },
            // TODO: more than just update time?
            nextStep: () => set(state => ({ time: state.time + 1 })),
            rmPurchased: (id, qty = 1) => set(state => {
                const store = state.actions.getById(id);
                console.log(store, id);
                if (!store) return {};

                const { cash } = state;
                const payment = qty * store.unitCost;
                // TODO: update store.qty.
                return { cash: cash - payment };
            }),
            dispatch: (type, payload) => console.log(type, payload),
        },
    };
});

/* 
"NEXT_STEP", info
"RM_CLICKED", store
"FG_CLICKED", store
"OPERATION_SET", mac, lastOp
"RM_PURCHASED", store
*/
