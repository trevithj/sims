import {publish, subscribe} from "../pubsub.js";
import {getData} from "./controls.js";
import {getItemsMap} from "./items.js";
import {getRM, getItem, getWorker, updateStock, getWIP} from "./selectors.js";
import { getOpsMap } from "./operations.js";
import {getWorkersMap} from "./workers.js";
import {getStoresMap} from "./stores.js";

const viz = document.querySelector("div.theViz");
const DATA = getData(1000, document.querySelector(".info"));
DATA.display();
const SIM = { publish, subscribe };
globalThis.SIM = SIM;

fetch("./theRace02.svg").then(r => r.text()).then(raw => {
    viz.innerHTML = raw;
    publish("InitDone", viz);
});

function buyRM(qty = 5) {
    return () => {
        const store = SIM.storesMap.get("rm");
        store.update(qty);
    }
}

subscribe("TestBuyRM", qty => buyRM(qty)());

function swapJobs() {
    DATA.worker = "setup";
    const oldJob = DATA.job; 
    const newJob = oldJob === "cd" ? "ab" : "cd";
    publish("WorkerAllocated", { workerId: "b1", oldJob, newJob });
    getItem(oldJob).classList.remove("move2");
    DATA.job = newJob;
}

function addJobListener() {
    const w = SIM.workersMap.get("b1");
    w.addEventListener("transitionend", () => {
        if (DATA.hasFinished) return;
        publish("SetupDone", {opId: `op-${DATA.job}`});
    })
}

const btns = document.querySelectorAll(".controls button");
btns[0].disabled = true;
btns[1].disabled = true;
btns[2].disabled = true;
btns[0].addEventListener("click", buyRM(5));
btns[1].addEventListener("click", buyRM(1));
btns[2].addEventListener("click", swapJobs);
btns[3].addEventListener("click", startRun);

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

function startRun() {
    btns[0].disabled = false;
    btns[1].disabled = false; 
    btns[2].disabled = false; 
    btns[3].disabled = true;
    const timer = setInterval(() => {
        DATA.tick();
        DATA.display()
    }, 500);
    
    subscribe("SimFinished", () => {
        clearInterval(timer);
        finish();
    })
    
    publish("SimStarted");
}

function finish() {
    viz.querySelectorAll(".busy").forEach(el => el.classList.remove("busy"));
    viz.querySelectorAll(".move1").forEach(el => el.classList.remove("move1"));
    viz.querySelectorAll(".move2").forEach(el => el.classList.remove("move2"));
    btns[0].disabled = true;
    btns[1].disabled = true;
    btns[2].disabled = true;
    btns[3].disabled = true;
    DATA.display();
}

subscribe("InitDone", () => {
    SIM.workersMap = getWorkersMap();
    SIM.storesMap = getStoresMap();
    SIM.itemsMap = getItemsMap();
    SIM.opsMap = getOpsMap(SIM.workersMap, SIM.storesMap);
    addJobListener();
});
