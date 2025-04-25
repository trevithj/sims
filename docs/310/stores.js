import {publish} from "../common/pubsub.js";
import {createElSVG} from "../common/selectors.js";

const textPos = "dominant-baseline=middle text-anchor=middle";

export function createStore(storeDefn) {
    const {row, col, type, qty = 0} = storeDefn;
    const element = createElSVG('g');
    const x = col * 10 - 10;
    const y = 90 - row * 10;
    element.style = `transform: translate(${x}px, ${y}px)`;

    const html = [
        `<rect x=2 y=1 width=6 height=4 stroke-width=0.2 class=${type} />`,
        `<text ${textPos} y=3 x=5 class="store">${qty}</text>`
    ].join('');
    element.innerHTML = html;

    // Add listeners
    if (type === 'RM') {
        element.addEventListener('click', () => {
            publish('RM_CLICKED', storeDefn);
        })
    }
    if (type === 'FG') {
        element.addEventListener('click', () => {
            publish('FG_CLICKED', storeDefn);
        })
    }

    const update = qty => element.querySelector("text.store").textContent = qty;

    return {...storeDefn, x, y, element, update};
};