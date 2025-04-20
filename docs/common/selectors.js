export function select(sel, el = document) {
    return el.querySelector(sel);
}

export function selectAll(sel, el = document) {
    return el.querySelectorAll(sel);
}

export function createEl(type, className) {
    const el = document.createElement(type);
    if (className) el.classList.add(className);
    return el;
}

export function createElSVG(type) {
    return document.createElementNS('http://www.w3.org/2000/svg', type);
}
