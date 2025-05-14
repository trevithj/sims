import {animateCircleTranslate, getCirclePoints} from "./animate";

const STATE = { variation: 500 };

const BaseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
BaseCircle.setAttribute('r', 8);
BaseCircle.setAttribute('fill', "silver");

const SVG = document.querySelector("svg");

function makeStoreElement(x, y, qty = 0) {
    const group = SVG.querySelector('g.stores');
    const back = BaseCircle.cloneNode();
    back.setAttribute("cx", x + 3);
    back.setAttribute("cy", y - 3);
    group.appendChild(back);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.textContent = qty;
    group.appendChild(text);
}

const points = getCirclePoints(8);
points.forEach(point => {
    makeStoreElement(point.cx, point.cy, 2);
});

function makeStore(element) {
    const x = +element.getAttribute("x");
    const y = +element.getAttribute("y");
    return Object.freeze({
        x, y,
        get soh() {return +element.textContent || 0;},
        set soh(qty) {element.textContent = qty;}
    });
}

const stores = Array.from(SVG.querySelectorAll("g.stores > text")).map(makeStore);

const ops = stores.map((fedby, index) => {
    const fedto = stores[(index + 1) % stores.length];
    return {fedby, index, fedto};
})
console.log(stores, ops);
window.BASE = {stores, ops, STATE };

function randomDuration() {
    const r = Math.random() * STATE.variation;
    return Math.round(1000 - STATE.variation + r);
}

const doAnimate = animateCircleTranslate(SVG.querySelector("g.flows"));

function runOpIfPossible(index) {
    if (STATE.pause) return;
    const op = ops[index % ops.length];
    if (op.status === "running") return;
    if (op.fedby.soh <= 0) {
        op.status = "waiting";
        return;
    }
    op.status = "running";
    // console.log(op, index);
    op.fedby.soh -= 1;
    doAnimate(op.fedby, op.fedto, randomDuration(), () => {
        op.fedto.soh += 1;
        op.status = "waiting";
        // runOpIfPossible(index+1);
        // setTimeout(() => {
        runOpIfPossible(index);
        runOpIfPossible(index + 1);
        // }, 200);
    });
}


document.querySelector("button#runBtn").addEventListener("click", () => {
    STATE.pause = false;
    runOpIfPossible(0);
    runOpIfPossible(1);
    runOpIfPossible(2);
    runOpIfPossible(3);
    runOpIfPossible(4);
    runOpIfPossible(5);
    runOpIfPossible(6);
    runOpIfPossible(7);
});

document.querySelector("button#pauseBtn").addEventListener("click", () => {
    STATE.pause = true;
});

// function getNextStore(thisIndex) {
//     return
// }