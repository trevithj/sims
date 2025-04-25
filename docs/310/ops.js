import {createElSVG, select} from "../common/selectors.js";

const textPos = "dominant-baseline=middle text-anchor=middle";

export function createOp(opDefn, fill) {

    const element = createElSVG('g');
    const x = opDefn.col * 10 - 10;
    const y = 90 - opDefn.row * 10;
    element.style = `transform: translate(${x}px, ${y}px)`;
    const html = [
        `<title>${opDefn.id}</title>`,
        `<ellipse cy=7.5 cx=5 rx=2.9 ry=2.3 fill=${fill} stroke=black />`,
        `<text ${textPos} y=7.5 x=5 class="optxt">${opDefn.runtime}</text>`
    ].join('');
    element.innerHTML = html;

    const shape = select("ellipse", element);

    const update = op => {
        const {status} = op;
        if (status === "set") {
            shape.classList.add("selected");
        } else {
            shape.classList.remove("selected");
        }
    }
    return { ...opDefn, x, y, element, update }
}
