import {subscribe} from "../pubsub.js";

// Selector functions
const viz = globalThis?.document?.querySelector("div.theViz");

export function makeWorker(workerId) {
    // Mock for node tests
    if (!viz) return null;
    const element = viz.querySelector(`#worker-${workerId}`);
    if (!element) return null;

    // element.addEventListener("transitionend", () => {
    //     leave it up to controlling code to check if worker has SOH
    //     publish("SetupDone", workerId);
    // })
    const worker = {
        workerId,
        addEventListener: (...args) => element.addEventListener(...args),
        get cx() {
            return element.getAttribute("cx");
        },
        set cx(v) {
            element.setAttribute("cx", v);
        },
        setStatus(s) {
            if (s === "busy") {
                element.classList.add("busy");
            }
            if (s === "idle") {
                element.classList.remove("busy");
            }
        }
    };
    subscribe("WorkerAllocated", d => {
        if(d.workerId !== workerId) return;
        worker.setStatus("idle");
        // TODO: use op.src, op.tgt data to transition to new cx value
        //if (d.oldJob===)
        worker.cx = worker.cx ==="100" ? "400" : "100";
    })
    return worker;
}

const Workers = ["r1", "r2", "r3", "b1"];

export const getWorkersMap = () => new Map(Workers.map(key => {
    const value = makeWorker(key);
    return [key, value];
}));