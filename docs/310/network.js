import {publish, subscribe} from "../common/pubsub.js";
import {createElSVG, select} from "../common/selectors.js";
import {createOp} from "./ops.js";
import {createStore} from "./stores.js";
import {theManager, actions, getLastNext} from "./stateManager.js";

// const { actions } = theManager.getState();

export function initNetwork(defn) {

    const { data, macColors } = defn;
    const { stores, ops } = data;
    // The network

    // const SIZE = 'width=10 height=10';
    // const textPos = "dominant-baseline=middle text-anchor=middle";

    // function create(node) {
    //     const element = createElSVG('g');
    //     const x = node.col * 10 - 10;
    //     const y = 90 - node.row * 10;
    //     element.style = `transform: translate(${x}px, ${y}px)`;
    //     return {element, x, y};
    // }
    // const renderStore = (node, store) => {
    //     const html = [
    //         `<rect x=2 y=1 width=6 height=4 stroke-width=0.2 class=${store.type} />`,
    //         `<text ${textPos} y=3 x=5 class="store">${store.qty}</text>`
    //     ].join('');
    //     node.element.innerHTML = html;
    // }

    const nodesMap = {}; // Needed for line plotting
    function mapNode(node) {
        nodesMap[node.id] = node;
        return node;
    }

    // Initial create and render of nodes
    const _stores = stores.map(storeDefinition => {
        const storeNode = createStore(storeDefinition);
        mapNode(storeNode);
        return storeNode;
    });
    const _ops = ops.map(opDefinition => {
        const fill = macColors[opDefinition.type] || 'white';
        const opNode = createOp(opDefinition, fill);
        mapNode(opNode);
        return opNode;
    })

    // Create the SVG view and add node elements
    const svg = document.querySelector('svg');
    const html = [
        '<rect x=0 y=10 width=80 height=10 class="background" />',
        '<rect x=0 y=30 width=80 height=10 class="background" />',
        '<rect x=0 y=50 width=80 height=10 class="background" />',
        '<rect x=0 y=70 width=80 height=10 class="background" />',
        '<rect x=10 y=0 width=10 height=90 class="background" />',
        '<rect x=30 y=0 width=10 height=90 class="background" />',
        '<rect x=50 y=0 width=10 height=90 class="background" />',
        '<rect x=70 y=0 width=10 height=90 class="background" />',

        '<path id="links" fill=none stroke=silver stroke-width=0.5px />',
        '<g id="grid" />',
        '<g id="nodes" />',
    ];
    svg.innerHTML = html.join("\n");
    const nodeView = select('g#nodes');
    // Adding the node elements
    _ops.forEach(op => {
        nodeView.appendChild(op.element);
    })
    _stores.forEach(store => {
        nodeView.appendChild(store.element);
    })

    // Draw the links
    const path = select("path#links");
    const d = [];
    Object.keys(nodesMap).forEach(id => {
        const src = nodesMap[id];
        src.fedto.forEach(tgtId => {
            const tgt = nodesMap[tgtId];
            d.push(`M ${src.x},${src.y}`);
            d.push(`L${src.x},${tgt.y + 5} L${tgt.x},${tgt.y + 5}`);
        });
    });
    path.setAttribute("d", d.join(' '));

    // Add listeners
    _stores.forEach(store => {
        if (store.type === 'RM') {
            store.element.addEventListener('click', () => {
                publish('RM_CLICKED', store);
            })
        }
        if (store.type === 'FG') {
            store.element.addEventListener('click', () => {
                publish('FG_CLICKED', store);
            })
        }
    })
    // console.log(nodesMap);
    subscribe('RM_PURCHASED', (d) => {
        const rm = nodesMap[d.id];
        console.log(rm);
        const qty = rm.qty + 1;
        renderStore(rm, { ...rm, qty });
    })

    subscribe('FG_CLICKED', (fg) => {
        console.log(fg);
    })
    subscribe('OPERATION_SET', (data) => {
        const { id, lastOp = "-" , currentOp} = data;
        console.log(`Machine ${id} changed from ${lastOp} to ${currentOp}`);
    })

    // draw the reference grid
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(row =>
        `<text class="row" x=-3 y=${96 - (10 * row)}>${row}</text>`
    );
    const cols = 'A B C D E F G H'.split(' ').map((col, i) =>
        `<text class="col" y=99 x=${10 * i + 4}>${col}</text>`
    );
    select("#grid").innerHTML = [...rows, ...cols].join("");

    // Handle updates
    theManager.subscribe((state, oldState) => {
        const opStatus = getLastNext(oldState, state, "opStatus");
        _ops.forEach(op => {
            const status = opStatus.next[op.id];
            if (status === opStatus.last[op.id]) return;
            op.update(status); 
        })
        const storeQty = getLastNext(oldState, state, "storeQty");
        _stores.forEach(store => {
            const qty = storeQty.next[store.id];
            if (qty === storeQty.last[store.id]) return;
            store.update(qty); 
        })
    })

};