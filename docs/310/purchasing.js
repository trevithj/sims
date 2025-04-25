import {publish} from "../common/pubsub.js";
import {createEl, select} from "../common/selectors.js";
import {theManager, actions} from "./stateManager.js";

// const {actions} = theManager.getState();

export function initPurchasing(defn) {
    const {data} = defn;

    const rms = data.stores.flatMap(store => {
        const {type, id, unitCost} = store;
        if (type !== "RM") return [];
        const name = id.replace("ST:", "RM").replace("-0", "");
        return {id, name, unitCost, store};
    });

    const purchasesEl = select('div.purchases');
    rms.forEach(rm => {
        const btn = createEl('button', 'purchase');
        btn.innerText = `${rm.name}@$${rm.unitCost}`;
        btn.addEventListener('click', () => {
            actions.rmPurchased(rm.id);
            // publish('RM_PURCHASED', rm.store);
        })
        purchasesEl.appendChild(btn);
    })
};
