import {makeStore} from "../balancedLine2/newStore.js";
import CLOCK from "./clockControl.js";

console.log(CLOCK);

const viz = document.querySelector("svg");
const lines = viz.querySelector("g.lines");
const stores = viz.querySelector("g.stores");
const flows = viz.querySelector("g.flows");
const net = {
    stores: [
        makeStore({ id:"rmA", soh:10, x:100, y:450 }),
        makeStore({ id:"rmC", soh:20, x:200, y:450 }),
        makeStore({ id:"rmE", soh:30, x:300, y:450 }),
    ]
}
// stores.append(net.stores.map(s => s.parent));
net.stores.forEach(s => stores.append(s.parent));
console.log(net);
document.body.appendChild(CLOCK.theClock);