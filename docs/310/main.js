// import BASE from "../../../common/modules/base.js";
// import * as DATA from "../../../data/sims/310.module.js";
// import * as DATA from "./definition.js";
import { theManager } from "./stateManager.js";
import { initInfo } from "./info.js";
import { initNetwork } from "./network.js";
import { initResources } from "./resources.js";
import { initOrders} from "./orders.js";

const Default = {
    data: {},
    macColors: {},
    info: {cash: 0, time: 0, speed: 0}
};
function nextStep(info) {
    return {...info, time: info.time + 1};
}

// BASE.initState((state = Default, {type, payload}) => {
//     switch (type) {
//         case 'DATA_SET': {
//             return {...state, ...payload}
//         }
//         case 'NEXT_STEP': {
//             return { ...state, info: nextStep(state.info, payload) };
//         }
//         case 'RM_PURCHASED': {
//             //TODO
//             return state;
//         }
//         default: return state;
//     }
// });


console.log(theManager.getState());
// Set up the info screen
initInfo();
// Set up the network
initNetwork();
// Set up the macs
initResources();
// Set up the sim requirements
initOrders();
