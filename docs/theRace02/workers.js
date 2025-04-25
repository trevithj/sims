import {subscribe} from "../common/pubsub.js";

// Selector functions
const viz = globalThis?.document?.querySelector("div.theViz");

export function makeWorker(workerId, element) {
    if (!element) {
        element = viz.querySelector(`#worker-${workerId}`);
    }
    if (!element) return null;

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
    subscribe("WorkerReallocated", d => {
        if(d.workerId !== workerId) return;
        worker.setStatus("idle");
        worker.cx = worker.cx ==="100" ? "400" : "100";
    })
    subscribe("SimFinished", () => {
        worker.setStatus("idle");
    })

    return worker;
}

const Workers = ["r1", "r2", "r3", "b1"];

export const getWorkersMap = () => new Map(Workers.map(key => {
    const value = makeWorker(key);
    return [key, value];
}));
