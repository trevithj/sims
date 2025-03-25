import {publish} from "../pubsub";

function makeMockNode(id) {
    const node = {textContent: "", innerHTML: ""};
    return {
        id,
        get textContent() {
            return node.textContent; 
        },
        set textContent(txt) {
            node.textContent = `${txt}`; 
        }
    }
}
const createElement = globalThis?.document?.createElement || null;

function makeNode(id) {
    // Mock for node tests
    if (!createElement) return makeMockNode(id);
    const node = createElement("div");
    node.setAttribute("id", id);
    return node;
}

function construct(id, {min = 0, max = Number.MAX_SAFE_INTEGER, soh = 0}) {
    const node = makeNode(id);

    const give = qty => {
        soh += Math.abs(qty);
        node.textContent = soh;
        if (soh > max) throw Error("Exceeds stock capacity");
        publish("STOCK_INCREASED", {id, soh, qty});
    };
    const take = qty => {
        soh -= Math.abs(qty);
        node.textContent = soh;
        if (soh < min) throw Error("Stock depleted");
        publish("STOCK_DECREASED", {id, soh, qty});
    };
    return {node, give, take, get soh() {return soh;} };
}

export default construct;
