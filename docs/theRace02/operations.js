import {publish, subscribe} from "../common/pubsub.js";

/*  OPS
operation-id: source-store-id, target-store-id, item-id, worker-id
*/
const opsDefinitions = {
    "op-ra": "rm|wip-a|r1|a",
    "op-ab": "wip-a|wip-b|b1|b",
    "op-bc": "wip-b|wip-c|r2|c",
    "op-cd": "wip-c|wip-d|b1|d|",
    "op-df": "wip-d|fg|r3|e"
}

export const OPS = Object.keys(opsDefinitions);

function updateStore(store, delta) {
    const qty = store.qty + delta;
    if (qty < 0) return false;
    store.qty = qty;
    return true;
}

export function makeOp(opId, {getWorker, getStore}) {
    const defStr = opsDefinitions[opId];
    if (!defStr) throw Error("Unknown opId");
    const [srcId, tgtId, workerId] = defStr.split("|");
    const src = getStore(srcId);
    const tgt = getStore(tgtId);
    let worker = null;

    const theOp = {
        opId,
        status: "IDLE",
        getStock: (qty = 1) => {
            return updateStore(src, -qty) ? qty : 0;
        },
        putStock: (qty = 1) => {
            return updateStore(tgt, qty);
        }
    }
    subscribe("WorkerReallocated", d => {
        if (`op-${d.oldJob}` === opId) {
            worker.setStatus("idle");
            worker = null;
            theOp.status = "DEALLOCATED";
            publish("OpDeallocated", opId);
        } else if (`op-${d.newJob}` === opId) {
            theOp.status = "SETUP";
            worker = getWorker(d.workerId);
            worker.setStatus("idle");
        }
    });
    const checkSOH = () => {
        if (src.qty < 1) {
            theOp.status = "WAITING";
            worker.setStatus("idle");
        } else {
            src.update(-1);
            theOp.status = "READY";
            worker.setStatus("busy");
            publish("OpProcessStarted", opId);
        }
    }
    subscribe("OpProcessDone", id => {
        if (id !== opId) return;
        tgt.update(1);
        checkSOH();
    })
    subscribe("SetupDone", d => {
        if (d.opId !== opId) return;
        theOp.status = "WAITING";
        worker = getWorker(workerId);
        checkSOH();
    })
    subscribe("StoreUpdated", ({storeId}) => {
        if (storeId !== srcId) return;
        if (theOp.status !== "WAITING") return;
        checkSOH();
    });

    subscribe("SimStarted", () => {
        if(opId !=="op-cd") worker = getWorker(workerId);
        if (worker) {
            checkSOH();
        }
    })

    return theOp;
}

export const getOpsMap = (workersMap, storesMap) => {
    const getWorker = id => workersMap.get(id);
    const getStore = id => storesMap.get(id);
    return new Map(OPS.map(key => {
        const value = makeOp(key, {getWorker, getStore});
        return [key, value];
    }));
}
