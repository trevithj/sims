// Selector functions
const viz = document.querySelector("div.theViz");

function getStore(id) {
    const grp = viz.querySelector(id);
    const txt = grp.querySelector("text");
    const qty = parseInt(txt.textContent);
    return {txt, qty};
}

export function getRM(suffix) {
    return getStore(`g#rm-${suffix}`);
}

export function getWIP(suffix) {
    return getStore(`g#wip-${suffix}`);
}

export function getFG(suffix) {
    return getStore(`g#fg-${suffix}`);
}

export function getItem(id) {
    return viz.querySelector(`#item-${id}`);
}

export function getItem300(suffix) {
    const items = viz.querySelectorAll("g#items300 use");
    return suffix === "a" ? items[0] : items[1];
}

export function getWorker(suffix) {
    return viz.querySelector(`#worker-${suffix}`);
}

// Update functions
const stockMap = {
    "a0": "g#rm-a",
    "b0": "g#rm-b",
    "a1": "g#wip-a",
    "b1": "g#wip-b",
    "a2": "g#fg-a",
    "b2": "g#fg-b"
};

export function updateStock(opId, delta) {
    const id = stockMap[opId];
    const store = getStore(id);
    store.txt.textContent = store.qty + delta;
    return store;
}