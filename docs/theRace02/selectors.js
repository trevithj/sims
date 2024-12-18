// Selector functions
const viz = globalThis?.document?.querySelector("div.theViz");

export function getStore(storeId) {
    // Mock for node tests
    if (!viz) return { qty: 10, txt: { textContent: "10" }};
    const grp = viz.querySelector(`g#${storeId}`);
    console.log(storeId, grp);
    const txt = grp.querySelector("text");
    return {
        get qty() { return parseInt(txt.textContent); },
        set qty(n) { txt.textContent = n; }
    };
}

export function getRM() {
    return getStore("g#rm");
}

export function getWIP(suffix) {
    return getStore(`g#wip-${suffix}`);
}

export function getFG() {
    return getStore("g#fg");
}

export function getItem(id) {
    // Mock for node tests
    if (!viz) return {};
    return viz.querySelector(`#item-${id}`);
}

export function getItem300(suffix) {
    const items = viz.querySelectorAll("g#items300 use");
    return suffix === "a" ? items[0] : items[1];
}

export function getWorker(suffix) {
    // Mock for node tests
    if (!viz) return null;
    return viz.querySelector(`#worker-${suffix}`);
}

// Update functions
//map of opId(??) -> storeId
const stockMap = {
    "rm": "rm",
    "a": "wip-a",
    "b": "wip-b",
    "c": "wip-c",
    "d": "wip-d",
    "fg": "fg"
};

export function updateStock(storeId, delta) {
    const store = getStore(storeId);
    return updateStore(store, delta);
}

function updateStore(store, delta) {
    const qty = store.qty + delta;
    if (qty < 0) return false;
    store.qty = qty;
    return true;
}
