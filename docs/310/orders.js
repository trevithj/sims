import {select} from "../common/selectors.js";
import {theManager} from "./stateManager.js";

// const { actions } = theManager.getState();

export function initOrders(defn) {
    const {orders} = defn.data;
    const ordersEl = select(".orders");
    const orderHTML = [
        '<div class="orderGrid">',
        '<h3>ProductID</h3>',
        '<h3>Quantity</h3>',
        '<h3>Price</h3>',
        '<h3>Delivered</h3>',
    ];
    orders.map(order => {
        const { id, qty, price, delivered = 0 } = order;
        orderHTML.push(`<p>${id}</p><p>${qty}</p><p>${price}</p><p>${delivered}</p>`);
    });
    orderHTML.push('</div>');
    ordersEl.innerHTML = orderHTML.join('');

    //TODO return an update function
};
