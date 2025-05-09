import {publish} from "../common/pubsub.js";
import {createEl, select} from "../common/selectors.js";
import {theManager, actions} from "./stateManager.js";

function createMacUI(macDefinition, fill, macOps) {
    let currentOp = null;
    const element = createEl('div', 'macGrid');
    const {id, type, setup} = macDefinition;
    const style = `style="background-color: ${fill} ; color: white;"`;
    const options = macOps.map(opId => `<option value=${opId}>${opId}</option>`);
    options.unshift('<option value="-"> none </option>');
    element.innerHTML = [
        `<p ${style}>${id}</p>`,
        `<p ${style}>${type}</p>`,
        `<p ${style}>${setup}</p>`,
        `<p ${style} class="status">idle</p>`,
        `<p ${style}><select value=${currentOp || '-'}>${options.join('')}</select></p>`
    ].join('');
    element.querySelector('select').addEventListener('change', sel => {
        const lastOp = currentOp;
        currentOp = sel.target.value;
        publish('OPERATION_SET', {id, lastOp, currentOp});
        actions.allocateOp(id, currentOp, lastOp);
    });

    function update(status) {
        element.querySelector("p.status").textContent = status;
    }
    return { id, element, update};
}


export function initResources(defn) {
    // The resources

    const {macColors, macOpsMap, data} = defn;
    const macsEl = select(".resources");
    macsEl.innerHTML = '<div class="macGrid">'
        + '<h3>ID</h3><h3>Type</h3><h3>Setup</h3><h3>Status</h3><h3>Current Op</h3>'
        + '</div>';
    const _macs = data.macs.map(mac => {
        const macOps = macOpsMap[mac.id];
        const fill = macColors[mac.type];
        const macUI = createMacUI(mac, fill, macOps);
        macsEl.append(macUI.element);
        return macUI;
    });

    // Handle updates
    theManager.subscribe((state, oldState) => {
        const {macStatus} = state;
        const {macStatus: prevStatus} = oldState;
        _macs.forEach(macUI => {
            if (macStatus[macUI.id] === prevStatus[macUI.id]) return;
            macUI.update(macStatus[macUI.id]);
        });
    });
};
