import {makeNSElement, NS} from "../components.js";

const makeSVG = makeNSElement(NS.SVG);

export function makePins(yPosns = []) {
    const xPosns = [];
    let offset = 0;
    let next = 0;
    return yPosns.flatMap(cy => {
        xPosns.push(next);
        const els = xPosns.map(x => {
            const cx = x + offset;
            const el = makeSVG("circle", {cx, cy});
            el.classList.add("pin");
            return el;
        });
        offset -= 50;
        next += 100;
        return els;
    });
}

export function makeTextCells(xPosns = []) {
    return xPosns.flatMap(x => {
        const rect = makeSVG("rect", {x, y: 0 });
        const text = makeSVG("text", {x, y: 0, dx:15, dy:25 });
        text.innerHTML = "0";
        return [rect, text];
    });
}

const B = {delay: 500, cx: 0}; // scope
B.ball = document.querySelector("#ball");

function setPos(cx, cy) {
    B.ball.setAttribute("cx", cx);
    B.ball.setAttribute("cy", cy);
}

function* bouncer(options) {
    const {levels = 3} = options;
    let count = levels;
    // Initial movement is a straight drop
    yield {dy: 0, dx: 0};
    while (count > 0) {
        const dx = Math.random() > 0.5 ? 1 : -1;
        yield {dy: 1 + levels - count, dx};
        count -= 1;
    }
    return;
}

function run(value) {
    const {dx = 0, dy = 0} = value;
    B.cx += (dx * 50);
    B.cy = dy * 50;
    setPos(B.cx, B.cy);
}

function update(cx) {
    const txt = document.querySelector(`text[x="${cx}"]`);
    const val = parseInt(txt.innerHTML);
    txt.innerHTML = val + 1;
}

function runOnce(onDone) {
    B.cx = 0;
    B.ball.classList.add("bouncex");
    const runner = bouncer({levels: 6});
    //initial run
    run(runner.next().value);

    const interval = setInterval(() => {
        const v = runner.next();
        if (!v.done) {
            run(v.value);
        } else {
            update(B.cx);
            B.ball.classList.remove("bouncex");
            setPos(0,-50);
            clearInterval(interval);
            onDone();
        };
    }, B.delay);
}

export function runTest(evt) {
    const btn = evt.target;
    btn.setAttribute("disabled", "true");
    runOnce(() => {
        btn.removeAttribute("disabled");
    })
}

export function runContinuous(evt) {
    const btn = evt.target;
    const text = btn.innerHTML;
    if (text === "Stop") {
        B.running = false;
        btn.innerHTML = "Run";
        return;
    }
    btn.innerHTML = "Stop";
    B.running = true;
    const caller = () => {
        if (!B.running) return;
        setTimeout(() => {
            runOnce(caller);
        }, 10);
    };
    runOnce(caller);
}
