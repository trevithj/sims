import {publish} from "../../pubsub";

const paddleHeight = 5;
const paddleWidth = 75;

export function setupPaddle({svg}) {
    const bounds = svg.viewBox.baseVal;
    const xOffset = bounds.width - paddleWidth;

    let paddleX = (xOffset) / 2;
    const paddle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    paddle.setAttribute("x", paddleX);
    paddle.setAttribute("y", bounds.height - paddleHeight);
    paddle.setAttribute("width", paddleWidth);
    paddle.setAttribute("height", paddleHeight);
    paddle.setAttribute("fill", "blue");
    svg.append(paddle);

    function signalPaddleMoved() {
        paddle.setAttribute("x", paddleX);
        const left = paddleX;
        const right = paddleX + paddleWidth;
        publish("PADDLE_MOVED", {left, right});
    }
    signalPaddleMoved();

    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            paddleX = Math.min(paddleX + 7, xOffset);
            signalPaddleMoved();
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            paddleX = Math.max(paddleX - 7, 0);
            signalPaddleMoved();
        }
    }

    function mouseMoveHandler(e) {
        if (!e.shiftKey) return;
        paddleX = Math.max(Math.min(paddleX + e.movementX, xOffset), 0);
        signalPaddleMoved();
    }

    document.addEventListener("keydown", keyDownHandler, false);
    // document.addEventListener("keyup", keyUpHandler, false);
    svg.addEventListener("mousemove", mouseMoveHandler, false);

    function drawPaddle(ctx) {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    return drawPaddle;
}
