import {publish} from "../../pubsub";

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const brickStack = [];

export function setupBricks({svg}) {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            const brick = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            brick.setAttribute("x", brickX);
            brick.setAttribute("y", brickY);
            brick.setAttribute("width", brickWidth);
            brick.setAttribute("height", brickHeight);
            brick.setAttribute("fill", "#dd9500");
            svg.append(brick);
        
            brickStack.push({x: brickX, y: brickY, brick});
        }
    }
}

export function brickAt(x, y) {
    if (brickStack.length===0) {
        publish("YOU_WIN");
        return;
    }
    const index = brickStack.findIndex(b => {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
            return true;
        }
    });
    if (index === -1) return null;
    const brick = brickStack[index].brick;
    brickStack.splice(index, 1);
    publish("BRICK_HIT", { brick });
    brick.remove();
    return brick;
}