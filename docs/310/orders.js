import {createEl, select} from "../common/selectors.js";
import {theManager} from "./stateManager.js";

function createOrderUI(orderDefinition) {
    const element = createEl('div', 'orderRow');
    const {id, qty, price, delivered = 0} = orderDefinition;
    const rowHTML = `<p>${id}</p><p>${qty}</p><p>${price}</p>`
        + `<p class="delivered">${delivered}</p>`;
    element.innerHTML = rowHTML;
    const deliveredEl = select("p.delivered", element);
    const update = qtyDelivered => {
        deliveredEl.textContent = qtyDelivered;
    }
    return {id, element, update};
};

export function initOrders(defn) {
    const {orders} = defn.data;
    const ordersEl = select(".orders");
    const orderHTML = '<div class="orderRow">'
        + '<h3>ProductID</h3>'
        + '<h3>Quantity</h3>'
        + '<h3>Price</h3>'
        + '<h3>Delivered</h3>'
        + '</div>';
    ordersEl.innerHTML = orderHTML;
    const orderUIs = orders.map(order => {
        const orderUI = createOrderUI(order);
        ordersEl.append(orderUI.element);
        return orderUI;
    });

    // Handle updates
    theManager.subscribe((state, oldState) => {
        const {ordersQty} = state;
        const {ordersQty: prevQty} = oldState;
        orderUIs.forEach(orderUI => {
            const {id, update} = orderUI;
            if (ordersQty[id] === prevQty[id]) return;
            update(ordersQty[id]);
        });
    })
};
