import {publish, subscribe} from "../pubsub.js";
import {makeOutput} from "./output.js";
import {getItemsMap} from "./items.js";
import { getOpsMap } from "./operations.js";
import {getWorkersMap} from "./workers.js";
import {getStoresMap} from "./stores.js";

const viz = document.querySelector("div.theViz");
const OUTPUT = makeOutput(1000, document.querySelector(".info"));
OUTPUT.display();
const SIM = { publish, subscribe };
globalThis.SIM = SIM; // for Testing

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

function swapJobs() {
    const oldJob = OUTPUT.job; 
    const newJob = oldJob === "cd" ? "ab" : "cd";
    publish("WorkerReallocated", { workerId: "b1", oldJob, newJob });
    OUTPUT.job = newJob;
}

function addJobListener() {
    const w = SIM.workersMap.get("b1");
    w.addEventListener("transitionend", () => {
        if (OUTPUT.hasFinished) return;
        publish("SetupDone", {opId: `op-${OUTPUT.job}`});
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

function startRun() {
    btns[0].disabled = false;
    btns[1].disabled = false; 
    btns[2].disabled = false; 
    btns[3].disabled = true;
    const timer = setInterval(() => {
        OUTPUT.tick();
        OUTPUT.display()
    }, 500);
    
    subscribe("SimFinished", () => {
        clearInterval(timer);
        finish();
    })
    
    publish("SimStarted");
}

function finish() {
    btns[0].disabled = true;
    btns[1].disabled = true;
    btns[2].disabled = true;
    btns[3].disabled = true;
    OUTPUT.display();
}

subscribe("InitDone", () => {
    SIM.workersMap = getWorkersMap();
    SIM.storesMap = getStoresMap();
    SIM.itemsMap = getItemsMap();
    SIM.opsMap = getOpsMap(SIM.workersMap, SIM.storesMap);
    addJobListener();
});
