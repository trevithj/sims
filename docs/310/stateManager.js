import {createStore} from "zustand/vanilla";
import * as DEFN from "./definition.js";
import {makePriorityQueue} from "../common/simHelpers.js";

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

const taskQueue = makePriorityQueue();

function getTasks(time) {
    if (taskQueue.peek() === null) return [];
    const aTasks = [];
    while (taskQueue.peekPriority() <= time) {
        aTasks.push(taskQueue.dequeue());
    }
    return aTasks;
}

const clampSpeed = clamp(0, 20);

export const theManager = createStore((set) => {
    const idMap = makeIdMap(DEFN.data);
    const {ops, macs, stores, orders} = DEFN.data;

    return {
        currentTasks: [],
        idMap,
        opStatus: makeMap(ops, () => "?"),
        ordersQty: makeMap(orders, () => 0),
        macStatus: makeMap(macs, () => "idle"),
        macCurrentOp: makeMap(macs, () => null),
        storeQty: makeMap(stores, s => s.qty),
        ...DEFN.info
    };
});

///////////////////////////////////////////////////
const DO = {
    MAC_READY: (state, {mac}) => {
        const macId = mac.id;
        const macStatus = {...state.macStatus, [macId]: "ready" };
        return {...state, macStatus };
    }
}

function reduce(state, action) {
    const execute = DO[action.type];
    return execute ? execute(state, action) : state;
}

const getById = id => theManager.getState().idMap.get(id) || null;

export function getLastNext(lastState, nextState, property) {
    const last = lastState[property];
    const next = nextState[property];
    const same = last === next;
    return {last, next, same};
}

export const actions = {
    nextStep: (step = 1) => {
        theManager.setState(state => {
            const time = state.time + Math.abs(step);
            // execute current tasks
            const currentTasks = getTasks(time);
            const newState = currentTasks.reduce(reduce, state);
            return {...newState, time, currentTasks};
        });
    },
    allocateOp: (macId, opId, lastOpId) => theManager.setState(state => {
        const opStatus = {...state.opStatus, [lastOpId || opId]: "?", [opId]: "set"};
        const macStatus = {...state.macStatus, [macId]: "setup"};
        const macCurrentOp = {...state.macCurrentOp, [macId]: opId};
        const mac = getById(macId);
        taskQueue.remove(value => value.mac === mac && value.type ==="MAC_READY");
        taskQueue.enqueue({mac, type: "MAC_READY"}, state.time + mac.setup);
        return {macStatus, macCurrentOp, opStatus};
    }),
    rmPurchased: (id, qty = 1) => theManager.setState(state => {
        const store = getById(id);
        if (!store) return {};

        const payment = qty * store.unitCost;
        // Update store.qty.
        const soh = state.storeQty[id];
        const storeQty = {...state.storeQty, [id]: soh + qty};
        return {cash: state.cash - payment, storeQty};
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
