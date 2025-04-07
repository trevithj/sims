import {publish} from "../pubsub";

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const brickStack = [];
for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        brickStack.push({x: brickX, y: brickY, status: 1});
    }
}

export function drawBricks(ctx) {
    brickStack.forEach(brick => {
        const {x, y, status} = brick;
        if (status !== 1) return;
        ctx.beginPath();
        ctx.rect(x, y, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    })
}

export function brickAt(x, y) {
    const index = brickStack.findIndex(b => {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
            return true;
        }
    });
    if (index === -1) return null;
    const brick = brickStack[index];
    brickStack.splice(index, 1);
    publish("BRICK_HIT", { brick });
    if (brickStack.length===0) {
        publish("YOU_WIN");
    }
    return brick;
}