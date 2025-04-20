import {publish, subscribe} from "../common/pubsub.js";
import {createElSVG, select} from "../common/selectors.js";
import {theManager} from "./stateManager.js";

export function initNetwork() {

    const { stores, ops, macColors } = theManager.getState();
    // The network
    const SIZE = 'width=10 height=10';
    const textPos = "dominant-baseline=middle text-anchor=middle";
    function create(node) {
        const element = createElSVG('g');
        const x = node.col * 10 - 10;
        const y = 90 - node.row * 10;
        element.style = `transform: translate(${x}px, ${y}px)`;
        return {element, x, y};
    }
    const renderStore = (store) => {
        const html = [
            `<rect x=2 y=1 width=6 height=4 stroke-width=0.2 class=${store.type} />`,
            `<text ${textPos} y=3 x=5 class="store">${store.qty}</text>`
        ].join('');
        store.element.innerHTML = html;
    }
    const renderOp = (op) => {
        // console.log(op);
        if (!op.element.innerHTML) {
            const html = [
                `<title>${op.id}</title>`,
                `<ellipse cy=7.5 cx=5 rx=2.9 ry=2.3 fill=${op.fill} stroke=black />`,
                `<text ${textPos} y=7.5 x=5 class="optxt">${op.runtime}</text>`
            ].join('');
            op.element.innerHTML = html;
        } 
        const shape = op.element.querySelector("ellipse");
        if (op.selected) { // status?
            shape.classList.add("selected");
        } else {
            shape.classList.remove("selected");
        }
    }

    const nodesMap = {}; // Needed for line plotting
    function mapNode(node) {
        nodesMap[node.id] = node;
        return node;
    }

    // Initial create and render of nodes
    const _stores = stores.map(store => {
        const {element, x, y} = create(store);
        const node = mapNode({...store, x, y, element});
        // element.innerHTML = renderStore(store);
        renderStore(node);
        return node;
    });
    const _ops = ops.map(op => {
        const fill = macColors[op.type] || 'white';
        const {element, x, y} = create(op);
        const node = mapNode({...op, x, y, fill, element, selected: 0 });
        // element.innerHTML = renderOp(op, fill);
        // return mapNode({...op, x, y, fill, element });
        renderOp(node);
        return node;
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
        rm.qty += 1;
        renderStore(rm);
    })

    subscribe('FG_CLICKED', (fg) => {
        console.log(fg);
    })
    subscribe('OPERATION_SET', (data) => {
        const updateOp = (id, selected) => {
            const op = nodesMap[id];
            if(op) {
                op.selected += selected;
                renderOp(op);
            }
        }
        const { mac, lastOp = "-" } = data;
        console.log(`Machine ${mac.id} changed from ${lastOp} to ${mac.currentOp}`);
        updateOp(lastOp, -1);
        updateOp(mac.currentOp, 1);
    })

    // draw the reference grid
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(row =>
        `<text class="row" x=-3 y=${96 - (10 * row)}>${row}</text>`
    );
    const cols = 'A B C D E F G H'.split(' ').map((col, i) =>
        `<text class="col" y=99 x=${10 * i + 4}>${col}</text>`
    );
    select("#grid").innerHTML = [...rows, ...cols].join("");
};