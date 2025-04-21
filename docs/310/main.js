// import BASE from "../../../common/modules/base.js";
// import * as DATA from "../../../data/sims/310.module.js";
// import * as DATA from "./definition.js";
import { theManager } from "./stateManager.js";
import { initInfo } from "./info.js";
import { initNetwork } from "./network.js";
import { initResources } from "./resources.js";
import { initOrders} from "./orders.js";
import {logging} from "../common/pubsub.js";

// const Default = {
//     data: {},
//     macColors: {},
//     info: {cash: 0, time: 0, speed: 0}
// };
// function nextStep(info) {
//     return {...info, time: info.time + 1};
// }

const { actions } = theManager.getState();
const DEFN = actions.getDefinition();


logging(true);

// Set up the info screen
initInfo(DEFN);
// Set up the network
initNetwork(DEFN);
// Set up the macs
initResources(DEFN);
// Set up the sim requirements
initOrders(DEFN);

// TODO: set up subscribe, and decide what needs re-rendering
theManager.subscribe((newState, oldState) => {
    console.log({newState, oldState});
    // console.log([...newState.idMap.values()]);
});
