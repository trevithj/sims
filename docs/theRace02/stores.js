import {publish} from "../pubsub.js";

const viz = globalThis?.document?.querySelector("div.theViz") || null;

function getTextElement(storeId) {
    // Mock for node tests
    if (!viz) return { textContent: "10" };
    const grp = viz.querySelector(`g#${storeId}`);
    return grp.querySelector("text");
}
function getQty(textElement, delta = 0) {
    const soh = parseInt(textElement.textContent);
    const qty = soh + delta;
    if (qty < 0) throw Error("Qty cannot be negative");
    return qty;
}

export function makeStore(storeId, vals = {}) {
    const txt = getTextElement(storeId);
    const initQty = vals.qty || 0;
    txt.textContent = initQty;
    return Object.freeze({
        ...vals,
        storeId,
        get qty() { return getQty(txt); },
        update(delta) {
            const qty = getQty(txt, delta);
            txt.textContent = qty;
            publish("StoreUpdated", { storeId, qty, delta });
        },
    });
}

const STORES = [
    { x:100, y:500, qty: 0, storeId:"rm" },
    { x:100, y:300, qty: 0, storeId:"wip-a" },
    { x:100, y:100, qty: 0, storeId:"wip-b" },
    { x:400, y:100, qty: 0, storeId:"wip-c" },
    { x:400, y:300, qty: 0, storeId:"wip-d" },
    { x:400, y:500, qty: 0, storeId:"fg" },
]


export function getStoresMap() {
    const storesMap = new Map(STORES.map(obj => {
        const {storeId} = obj;
        const store = makeStore(storeId, obj);
        return [storeId, store];
    }));
    return storesMap;
}