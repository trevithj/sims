import {animateCircleTranslate, getCirclePoints} from "./animate";

const STATE = { variation: 300, blockers: 0, initSOH: 4, storeCount: 16 };

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

const points = getCirclePoints(STATE.storeCount);
points.forEach(point => {
    makeStoreElement(point.cx, point.cy, STATE.initSOH);
});

function makeStore(element) {
    const x = +element.getAttribute("x");
    const y = +element.getAttribute("y");
    const colr = code => element.style.fill = code;
    return Object.freeze({
        blocked: () => colr("white"),
        x, y,
        get soh() {return +element.textContent || 0;},
        set soh(qty) {
            element.textContent = qty;
            if (qty > 0) colr("black");
        }
    });
}

const stores = Array.from(SVG.querySelectorAll("g.stores > text")).map(makeStore);

const ops = stores.map((fedby, index) => {
    const fedto = stores[(index + 1) % stores.length];
    return {fedby, index, fedto};
})
// console.log(stores, ops);
// For debugging etc
window.BASE = {stores, ops, STATE };

function randomDuration() {
    const r = Math.random() * STATE.variation;
    return Math.round(600 - STATE.variation + r);
}

const doAnimate = animateCircleTranslate(SVG.querySelector("g.flows"));

function runOpIfPossible(index) {
    if (STATE.pause) return;
    const op = ops[index % ops.length];
    if (op.status === "running") return;
    if (op.fedby.soh <= 0) {
        op.status = "waiting";
        op.fedby.blocked();
        STATE.blockers += 1;
        return;
    }
    op.status = "running";
    // console.log(op, index);
    op.fedby.soh -= 1;
    doAnimate(op.fedby, op.fedto, randomDuration(), () => {
        op.fedto.soh += 1;
        op.status = "waiting";
        runOpIfPossible(index);
        runOpIfPossible(index + 1);
    });
}


const [pauseBtn, runBtn] = document.querySelectorAll("button");

runBtn.addEventListener("click", () => {
    STATE.pause = false;
    ops.forEach((_, index) => {
        runOpIfPossible(index);
    });
    runBtn.setAttribute("disabled", true);
    pauseBtn.removeAttribute("disabled");
});

pauseBtn.addEventListener("click", () => {
    STATE.pause = true;
    pauseBtn.setAttribute("disabled", true);
    runBtn.removeAttribute("disabled");

});
window.BASE.b0 = pauseBtn;
// function getNextStore(thisIndex) {
//     return
// }