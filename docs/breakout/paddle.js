import {publish} from "../pubsub";

const paddleHeight = 5;
const paddleWidth = 75;

export function setupPaddle({canvas}) {
    let rightPressed = false;
    let leftPressed = false;
    let paddleX = (canvas.width - paddleWidth) / 2;

    function signalPaddleMoved() {
        const left = paddleX;
        const right = paddleX + paddleWidth;
        publish("PADDLE_MOVED", {left, right});
    }
    signalPaddleMoved();

    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
            signalPaddleMoved();
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function drawPaddle(ctx) {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
        if (rightPressed) {
            paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
        } else if (leftPressed) {
            paddleX = Math.max(paddleX - 7, 0);
        }
        if (rightPressed || leftPressed) {
            signalPaddleMoved();
        }
    }
    return drawPaddle;
}
