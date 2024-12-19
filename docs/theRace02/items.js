import {publish, subscribe} from "../pubsub.js";

const viz = globalThis?.document?.querySelector("div.theViz");

const itemDefinitions = {
    "ra": { keyframes:[{y:500},{y:300}], duration: 5000 },
    "ab": { keyframes:[{y:300},{y:100}], duration: 500 },
    "bc": { keyframes:[{x:100},{x:400}], duration: 5000 },
    "cd": { keyframes:[{y:100},{y:300}], duration: 500 },
    "df": { keyframes:[{y:300},{y:500}], duration: 5000 }
}

const noFn = () => null;

function getItem(id) {
    // Mock for node tests
    if (!viz) return { addEventListener: noFn };
    return viz.querySelector(`#item-${id}`);
}

function getAnimation(element, defn) {
    // mock for node tests
    if (!viz) return { play: noFn, pause: noFn, addEventListener: noFn };
    const { keyframes, duration } = defn;
    const animation = element.animate(keyframes, { duration });
    animation.pause(); // so it doesn't run until told to
    return animation;
}

export function makeItem(itemId) {
    const theOpId = `op-${itemId}`;
    const defn = itemDefinitions[itemId];
    if (!defn) throw Error("Unknown itemId");
    const element = getItem(itemId);
    const animation = getAnimation(element, defn);

    subscribe("OpProcessStarted", opId => {
        if (opId === theOpId) animation.play();
    })
    subscribe("OpDeallocated", opId => {
        if (opId === theOpId) animation.pause();
    })
    subscribe("SimFinished", () => {
        animation.pause();
    })
    animation.addEventListener("finish", () => {
        publish("OpProcessDone", theOpId);
    })
    return { itemId, element, animation };
}

export function getItemsMap() {
    const itemIds = Object.keys(itemDefinitions);
    return new Map(itemIds.map(itemId => {
        const item = makeItem(itemId);
        return [itemId, item];
    }));
}
