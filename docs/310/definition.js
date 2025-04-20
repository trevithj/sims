const cols = '-ABCDEFGH';

function makeStore(col, row, qty = 0, type = 'ST') {
    const c = cols.charAt(col);
    const id = `ST:${c}-${row}`;
    return {id, type, row, col, qty, fedby: [], fedto: []};
}

function makeOp(type, col, row, runtime) {
    const c = cols.charAt(col);
    const id = `OP:${c}-${row}`;
    return {id, type, row, col, runtime, fedby: [], fedto: []};
}

function makeMac(type, setup, row, col) {
    const id = `MAC:${type}-${col}`;
    return {id, type, setup, row, col};
}

const nodes = {};

function mapNode(node) {
    nodes[node.id] = node;
}

function linkNodes(srcId, tgtId) {
    const src = nodes[srcId];
    const tgt = nodes[tgtId];
    try {
        src.fedto.push(tgtId);
        tgt.fedby.push(srcId);
    } catch (err) {
        console.error(`Bad link: ${srcId}->${tgtId}`, err);
    }
}

const ops = [
    makeOp("C", 1, 9, 18),
    makeOp("E", 1, 7, 20),
    makeOp("C", 1, 6, 15),
    makeOp("B", 1, 5, 15),
    makeOp("B", 1, 1, 4),
    makeOp("F", 2, 3, 8),
    makeOp("B", 3, 1, 5),
    makeOp("A", 3, 5, 6),
    makeOp("C", 4, 9, 6),
    makeOp("F", 4, 7, 9),
    makeOp("A", 5, 5, 28),
    makeOp("E", 5, 2, 10),
    makeOp("C", 5, 1, 9),
    makeOp("C", 6, 9, 10),
    makeOp("E", 6, 7, 7),
    makeOp("A", 6, 5, 14),
    makeOp("E", 6, 3, 20),
    makeOp("C", 6, 2, 12),
    makeOp("B", 6, 1, 15),
];

const stores = [
    makeStore(1, 0, 0, 'RM'),
    makeStore(3, 0, 0, 'RM'),
    makeStore(5, 0, 0, 'RM'),
    makeStore(6, 0, 0, 'RM'),
    makeStore(1, 9, 0, 'FG'),
    makeStore(1, 7),
    makeStore(1, 6),
    makeStore(1, 5),
    makeStore(1, 1),
    makeStore(2, 3, 25),
    makeStore(3, 1),
    makeStore(3, 5),
    makeStore(4, 7),
    makeStore(4, 9, 0, 'FG'),
    makeStore(5, 1),
    makeStore(5, 2, 15),
    makeStore(5, 5),
    makeStore(6, 1),
    makeStore(6, 2),
    makeStore(6, 3, 10),
    makeStore(6, 5),
    makeStore(6, 7),
    makeStore(6, 9, 0, 'FG'),
]

const macs = [
    makeMac("A", 15, 1, 1),
    makeMac("B", 120, 2, 1),
    makeMac("B", 120, 2, 2),
    makeMac("C", 50, 3, 1),
    makeMac("C", 50, 3, 2),
    makeMac("E", 30, 5, 1),
    makeMac("E", 30, 5, 2),
    makeMac("F", 0, 6, 1),
];

ops.forEach(mapNode);
stores.forEach(mapNode);
macs.forEach(mapNode);

//Update RM nodes with unit cost
nodes['ST:A-0'].unitCost = 30;
nodes['ST:C-0'].unitCost = 35;
nodes['ST:E-0'].unitCost = 30;
nodes['ST:F-0'].unitCost = 65;

//Add weekly orders list with qty and price
const orders = [
    {id: 'ST:A-9', price: 180, qty: 40},
    {id: 'ST:D-9', price: 240, qty: 50},
    {id: 'ST:F-9', price: 180, qty: 40},
];
// Now create the network
// First, link each op to its matching store
ops.forEach(op => {
    const ida = op.id.split(":");
    linkNodes(op.id, `ST:${ida[1]}`);
})
// Now link stores to next ops
linkNodes('ST:A-0', 'OP:A-1');
linkNodes('ST:C-0', 'OP:C-1');
linkNodes('ST:E-0', 'OP:E-1');
linkNodes('ST:F-0', 'OP:F-1');
linkNodes('ST:A-1', 'OP:B-3');
linkNodes('ST:C-1', 'OP:B-3');
linkNodes('ST:B-3', 'OP:A-5');
linkNodes('ST:B-3', 'OP:C-5');
linkNodes('ST:A-5', 'OP:A-6');
linkNodes('ST:A-6', 'OP:A-7');
linkNodes('ST:A-7', 'OP:A-9');
linkNodes('ST:C-5', 'OP:D-7');
linkNodes('ST:D-7', 'OP:D-9');
linkNodes('ST:E-1', 'OP:E-2');
linkNodes('ST:E-2', 'OP:E-5');
linkNodes('ST:E-5', 'OP:D-7');
linkNodes('ST:F-1', 'OP:F-2');
linkNodes('ST:F-2', 'OP:F-3');
linkNodes('ST:F-3', 'OP:F-5');
linkNodes('ST:F-5', 'OP:F-7');
linkNodes('ST:F-7', 'OP:F-9');

const data = {ops, macs, stores, orders};
const macColors = {
    A: '#66f',
    B: '#090',
    C: '#09c',
    D: '#c00',
    E: '#c0c',
    F: '#960',
    RM: 'red',
    FG: 'blue'
}
const info = {cash: 11000, time: 0, speed: 0};

export {data, macColors, info};
