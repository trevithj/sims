import {select} from "../common/selectors";
import {theManager, actions} from "./stateManager.js";

export function initInfo() {
    const {time, cash, speed} = theManager.getState();
    const view = select(".info");
    view.innerHTML = `
    <div id="time"></div>
    <div id="cash"></div>
    <button id="tick">Next Step</button>
    <button id="auto">Run Sim</button>
    <button id="quit">Quit</button>
    <input id="speed" type="range" min="1" max="10" />
    `;
    const info = {speed, running:false };
    const els = {
        timeEl: select('#time'),
        cashEl: select('#cash'),
        nextBtn: select('#tick'),
        autoBtn: select('#auto'),
        quitBtn: select('#quit'),
        speedEl: select('#speed'),
    }
    function fmt(n) {
        const a = [n < 10 ? '0' : '', n];
        return a.join("");
    }
    function updateTime(time) {
        // const week = Math.floor(time / 2400);
        const day = Math.floor(time / 480);
        const hour = fmt(Math.floor(time / 60));
        const min = fmt(time % 60);

        // <p>Week:<span>${week + 1}</span></p>
        els.timeEl.innerHTML = `
            <p>Day:<span>${day + 1}</span></p>
            <p>Time:<span>${hour}:${min}</span></p>
        `.trim();
    }
    function updateCash(cash) {
        els.cashEl.innerHTML = `
        <p>Cash on hand:<span>$${cash}</span></p>
        `.trim();
    }
    function tick() {
        actions.nextStep();
    }
    function autoTick() {
        tick();
        const {running, speed} = info;
        if (running) {
            const timeOut = (12 - speed) * 100;
            info.timeout = setTimeout(autoTick, timeOut);
        }
    }

    els.nextBtn.addEventListener("click", tick);
    els.autoBtn.addEventListener("click", () => {
        info.running = !info.running;
        clearTimeout(info.timeout);
        if (info.running) {
            els.autoBtn.innerHTML = "Pause";
            autoTick();
        } else {
            els.autoBtn.innerHTML = "Run Sim";
        }
    });
    els.speedEl.addEventListener('change', () => {
        actions.setSpeed(+els.speedEl.value);
    })
    // subscribe('RM_PURCHASED', (rm) => {
    //     const {unitCost = 0} = rm;
    //     info.cash -= unitCost;
    //     updateCash(info.cash);
    //     // if info.cash < 0 throw Error"end of sim"
    // })

    theManager.subscribe(state => {
        updateTime(state.time);
        updateCash(state.cash);
    })

    // Initialize view
    updateTime(time);
    updateCash(cash);
    actions.setSpeed(+els.speedEl.value);
};
