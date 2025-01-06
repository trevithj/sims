// Namespaces
export const NS = {
    SVG: "http://www.w3.org/2000/svg",
    HTML: "http://www.w3.org/1999/xhtml",
    MathML: "http://www.w3.org/1998/Math/MathML"
}

function createElementNS(namespace, type) {
    if (globalThis.document) return document.createElementNS(namespace, type);
    // mock for Node testing if needed
    const vals = new Map();
    vals.set("namespace", namespace);
    return {
        type,
        vals,
        innerHTML: "",
        innerText: "",
        setAttribute:(name, value) => vals.set(name, ""+value),
        getAttribute:(name) => vals.get(name),
        appendChild() {},
    };
}

export function makeNSElement(namespace) {
    return (type, attributes = {}) => {
        const el = createElementNS(namespace, type);
        Object.entries(attributes).forEach(pair => {
            const [name, value] = pair;
            el.setAttribute(name, value);
        });
        return el;
    }
}
