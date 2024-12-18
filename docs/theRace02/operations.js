import {publish, subscribe} from "../pubsub.js";
import {getItem, getStore, getWorker} from "./selectors.js";

/*  OPS
operation-id: source-store-id, target-store-id, item-id, worker-id
*/
const opsDefinitions = {
    "op-ra": "rm|wip-a|a|r1",
    "op-ab": "wip-a|wip-b|b|b1",
    "op-bc": "wip-b|wip-c|c|r2",
    "op-cd": "wip-c|wip-d|d|",
    "op-df": "wip-d|fg|e|r3"
}

export const OPS = Object.keys(opsDefinitions);

function updateStore(store, delta) {
    const qty = store.qty + delta;
    if (qty < 0) return false;
    store.qty = qty;
    return true;
}

export function makeOp(opId) {
    const defStr = opsDefinitions[opId];
    if (!defStr) throw Error("Unknown opId");
    const [srcId, tgtId, itemId, workerId] = defStr.split("|");
    const src = getStore(srcId);
    const tgt = getStore(tgtId);
    const item = getItem(itemId);
    let worker = getWorker(workerId);
    let status = "IDLE";

    subscribe("WorkerAllocated", d => {
        if (d.oldOpId === opId) {
            status = "IDLE";
            worker = null;
        } else if (d.newOpId === opId) {
            status = "SETUP";
            worker = getWorker(workerId);
        }
    });
    const checkSOH = () => {
        console.log("checking", src);
        if (src.qty < 1) status = "WAITING";
        else {
            status = "READY";
            runItemAnimation();
        }
    }
    subscribe("SetupDone", d => {
        if (d.opId !== opId) return;
        checkSOH();
    })
    subscribe("StoreUpdated", ({storeId}) => {
        if (storeId !== srcId) return;
        if (status !== "WAITING") return;
        checkSOH();
    });
    const isReady = () => {
        if (!worker) return false;
        if (src.qty < 1) return false;
        return true;
    }
    const runItemAnimation = () => {
        console.log("TODO: run item animation");
    }

    subscribe("SimStarted", () => {
        if(worker) {
            checkSOH();
        }
    })

    return {
        get status() {
            return status;
        },
        setWorker: element => {
            worker = element;
            if (isReady()) {
                publish("TODO: animateItem", itemId);
            }
        },
        getStock: (qty = 1) => {
            return updateStore(src, -qty) ? qty : 0;
        },
        putStock: (qty = 1) => {
            return updateStore(tgt, qty);
        }
    }
}

export const getOpsMap = () => new Map(OPS.map(key => {
    const value = makeOp(key);
    return [key, value];
}));
