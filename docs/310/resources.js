import {publish} from "../common/pubsub.js";
import {createEl, select} from "../common/selectors.js";
import {theManager} from "./stateManager.js";

const { actions } = theManager.getState();
// const { data, macColors } = actions.getDefinition();


export function initResources(defn) {
    // The resources
    //TODO: refactor to use one element per resource

    const { macColors, macOpsMap, data } = defn;
    const { macs, ops, stores } = data;
    const macsEl = select(".resources");
    const _macs = macs.map(mac => {
        const element = createEl('div', 'macGrid');
        const macOps = macOpsMap[mac.id];
        const fill = macColors[mac.type];
        return {...mac, ops: macOps, fill, currentOp: null, element}
    });

    // info.macsEl.querySelector('thead').innerHTML = `
    // <tr><th>ID</th><th>Type</th><th>Setup</th><th>Current Op</th></tr>
    // `.trim();
    macsEl.innerHTML = `
        <div class="macGrid">
            <h3>ID</h3><h3>Type</h3><h3>Setup</h3><h3>Status</h3><h3>Current Op</h3>
        </div>
        `.trim();
    function renderMac(mac) {
        const {id, ops, type, setup, status = 'idle', fill, currentOp} = mac;
        const style = `style="background-color: ${fill} ; color: white;"`;
        const options = ops.map(opId => `<option value=${opId}>${opId}</option>`);
        options.unshift('<option value="-"> none </option>');
        mac.element.innerHTML = [
            `<p ${style}>${id}</p>`,
            `<p ${style}>${type}</p>`,
            `<p ${style}>${setup}</p>`,
            `<p ${style} class="status">${status}</p>`,
            `<p ${style}><select value=${currentOp || '-'}>${options.join('')}</select></p>`
            ].join('');
        mac.element.querySelector('select').addEventListener('change', sel => {
            const lastOp = mac.currentOp;
            mac.currentOp = sel.target.value;
            publish('OPERATION_SET', { mac, lastOp });
            actions.allocateOp(mac.id, mac.currentOp, lastOp);
        });
    }
    _macs.forEach(mac => {
        renderMac(mac);
        macsEl.appendChild(mac.element);
    });

    const rms = stores.flatMap(store => {
        const { type, id, unitCost } = store;
        if (type !== "RM") return [];
        const name = id.replace("ST:", "RM").replace("-0", "");
        return {id, name, unitCost, store};
    });
    console.log(rms);
    const purchasesEl = createEl('div', 'purchases');
    rms.forEach(rm => {
        const btn = createEl('button', 'purchase');
        btn.innerText = `${rm.name}@$${rm.unitCost}`;
        btn.addEventListener('click', () => {
            actions.rmPurchased(rm.id);
            publish('RM_PURCHASED', rm.store);
        })
        purchasesEl.appendChild(btn);
    })
    macsEl.appendChild(purchasesEl);

    // Updater function
    function updateMac(mac, status) {
        mac.element.querySelector("p.status").textContent = status;
    }
    theManager.subscribe((state, oldState) => {
        const { macStatus } = state;
        const { macStatus:prevStatus } = oldState;
        _macs.forEach(mac => {
            if(macStatus[mac.id] === prevStatus[mac.id]) return;
            updateMac(mac, macStatus[mac.id]);
        });
    });
};
