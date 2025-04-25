import {createStore} from "zustand/vanilla";
import * as DEFN from "./definition.js";

function makeIdMap(data) {
    const {orders, stores, ops, macs} = data;
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
    const {ops, macs, stores, orders} = DEFN.data;
    const maps = {
        storeQty: makeMap(stores, s => s.qty),
        opStatus: makeMap(ops, () => "?"),
        macStatus: makeMap(macs, () => "idle"),
        macCurrentOp: makeMap(macs, () => null),
        ordersQty: makeMap(orders, () => 0),
    }

    return {
        idMap,
        ...maps,
        ...DEFN.info
    };
});
const getById = id => theManager.getState().idMap.get(id) || null;

export function getLastNext(lastState, nextState, property) {
    const last = lastState[property];
    const next = nextState[property];
    const same = last === next;
    return { last, next, same };
}

export const actions = {
    nextStep: () => theManager.setState(state => ({time: state.time + 1})),
    allocateOp: (macId, opId, lastOpId) => theManager.setState(state => {
        const opStatus = {...state.opStatus, [opId]: "set", [lastOpId]: "?"};
        const macStatus = {...state.macStatus, [macId]: "setup"};
        const macCurrentOp = {...state.macCurrentOp, [macId]: opId};
        return {macStatus, macCurrentOp, opStatus};
    }),
    rmPurchased: (id, qty = 1) => theManager.setState(state => {
        const store = getById(id);
        // console.log(store, id);
        if (!store) return {};

        const {cash} = state;
        const payment = qty * store.unitCost;
        // Update store.qty.
        const soh = state.storeQty[id];
        const storeQty = {...state.storeQty, [id]: soh + qty};
        return {cash: cash - payment, storeQty};
    }),
    setSpeed: speed => theManager.setState({
        speed: clampSpeed(speed)
    }),
    getById
}

/* 
"NEXT_STEP", info
"RM_CLICKED", store
"FG_CLICKED", store
"OPERATION_SET", mac, lastOp
"RM_PURCHASED", store
*/
