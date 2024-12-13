import {publish, subscribe} from "../pubsub.js";
import {getData} from "./controls.js";
import {getRM, getItem, getWorker, updateStock, getWIP} from "./selectors.js";

const viz = document.querySelector("div.theViz");
const DATA = getData(1000, document.querySelector(".info"));
DATA.display();

fetch("./theRace01.svg").then(r => r.text()).then(raw => {
    viz.innerHTML = raw;
    setTimeout(() => {
        publish("Init-done", viz);
    }, 0)
});

function buyRM(col, qty = 5) {
    return () => {
        updateStock(`${col}0`, qty);
        DATA.updateCash(-qty*10);
        publish("RM-Added", { col, qty });
    }
}

function swapJobs() {
    DATA.worker = "setup";
    const w = getWorker("x0");
    getItem(DATA.job).classList.remove("move2");
    w.classList.remove("busy");
    if (w.getAttribute("cx") === "100") {
        w.setAttribute("cx", "400");
        DATA.job = "b0";
    } else {
        w.setAttribute("cx", "100");
        DATA.job = "a0";
    }
}

function addJobListener() {
    const w = getWorker("x0");
    w.addEventListener("transitionend", () => {
        if (DATA.hasFinished) return;
        DATA.worker = "ready";
        const rm = updateStock(DATA.job, 0);
        if (rm.qty > 0) {
            w.classList.add("busy");
            getItem(DATA.job).classList.add("move2");
        }
    })
}

const btns = document.querySelectorAll(".controls button");
btns[0].disabled = true;
btns[1].disabled = true;
btns[2].disabled = true;
btns[0].addEventListener("click", buyRM("a"));
btns[1].addEventListener("click", buyRM("b"));
btns[2].addEventListener("click", swapJobs);
btns[3].addEventListener("click", startRun);

function addItemsListeners() {
    ["a", "b"].forEach(col => {
        const item = getItem(col+"0");
        item.addEventListener("animationiteration", () => {
            updateStock(col+"1", 1);
            publish("WIP-Added", col);
            updateStock(col+"0", -1);
            publish("RM-Removed", col);
        });
    });
    ["a", "b"].forEach(col => {
        const item = getItem(col+"1");
        item.addEventListener("animationiteration", () => {
            updateStock(col+"2", 1);
            publish("FG-Added", col);
            updateStock(col+"1", -1);
            publish("WIP-Removed", col);
        });
    });
}

function pauseWork(id) {
    const w = getWorker(id);
    const item = getItem(id);
    w.classList.remove("busy");
    item.classList.remove("move1");
};

function unPauseWork(id) {
    const w = getWorker(id);
    const item = getItem(id);
    w.classList.add("busy");
    item.classList.add("move1");
};

subscribe("WIP-Removed", col => {
    const wip = getWIP(col);
    if (wip.qty <= 0) {
        const id = [col, "1"].join("");
        pauseWork(id);
    }
    if (wip.qty < 0) throw Error("qty < 0 !!");
});

subscribe("WIP-Added", col => {
    const id = [col, "1"].join("");
    unPauseWork(id);
});

subscribe("RM-Added", data => {
    const { col } = data;
    const id = col+"0";
    if (DATA.isReady(id)) {
        const w = getWorker("x0");
        const item = getItem(id);
        w.classList.add("busy");
        item.classList.add("move2");
    }
});

subscribe("RM-Removed", col => {
    const rm = getRM(col);
    // if (rm.qty < 0) throw Error("qty < 0 !!");
    if (rm.qty <= 0) {
        const w = getWorker("x0");
        const item = getItem(col+"0");
        w.classList.remove("busy");
        item.classList.remove("move2");
    }
});

subscribe("FG-Added", (col) => {
    DATA.updateCash(30);
})

function startRun() {
    btns[0].disabled = false;
    btns[1].disabled = false;
    btns[2].disabled = false;
    btns[3].disabled = true;
    
    const timer = setInterval(() => {
        // TODO: every 480 ticks, sell up to 100 units, deduct expenses.
        if (DATA.hasFailed ) {
            clearInterval(timer);
            finish();
        } else if (DATA.hasFinished) {
            DATA.updateCash(-4000);
            clearInterval(timer);
            finish();
        } else {
            DATA.tick();
            DATA.display()
        }
    }, 500);
}

function finish() {
    viz.querySelectorAll(".busy").forEach(el => el.classList.remove("busy"));
    viz.querySelectorAll(".move1").forEach(el => el.classList.remove("move1"));
    viz.querySelectorAll(".move2").forEach(el => el.classList.remove("move2"));
    btns[0].disabled = true;
    btns[1].disabled = true;
    btns[2].disabled = true;
    DATA.display();
}

subscribe("Init-done", () => {
    addJobListener();
    addItemsListeners();
});
