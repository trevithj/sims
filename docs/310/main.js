import * as DEFN from "./definition.js";
import {theManager} from "./stateManager.js";
import {initInfo} from "./info.js";
import {initNetwork} from "./network.js";
import {initResources} from "./resources.js";
import {initOrders} from "./orders.js";
import {logging} from "../common/pubsub.js";
import {initPurchasing} from "./purchasing.js";

logging(true);

// Set up the info screen
initInfo(DEFN);
// Set up the network
initNetwork(DEFN);
// Set up the macs
initResources(DEFN);
// Set up RM purchase btns
initPurchasing(DEFN);
// Set up the sim requirements
initOrders(DEFN);

// TODO: set up subscribe, and decide what needs re-rendering
theManager.subscribe((newState, oldState) => {
    console.log({newState, oldState});
    // console.log([...newState.idMap.values()]);
});
