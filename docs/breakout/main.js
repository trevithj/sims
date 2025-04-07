import {subscribe} from "../pubsub";
import {setupBall} from "./ball";
import {drawBricks, brickAt} from "./bricks";
import {setupPaddle} from "./paddle"

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let drawBall;
let drawPaddle;
let score = 0;
let status = "";

function doAlert(message) {
    setTimeout(() => {
        alert(message);
        document.location.reload();
    }, 10)
}

// Drawing loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks(ctx);
    drawBall(ctx);
    drawPaddle(ctx);
    drawScore(ctx);
    if (!status) {
        requestAnimationFrame(draw);
    } else {
        doAlert(status);
    }
}

function drawScore(ctx) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function startGame() {
    drawPaddle = setupPaddle({canvas});
    drawBall = setupBall({canvas, brickAt});

    // const timer = setInterval(draw, 10);
    draw();
    subscribe("GAME_OVER", () => {
        status = "GAME OVER";
    })
    subscribe("BRICK_HIT", () => {
        score += 1;
    })
    subscribe("YOU_WIN", () => {
        status = "YOU WIN!! CONGRATULATIONS";
    })
}

document.getElementById("runButton").addEventListener("click", function () {
    startGame();
    this.disabled = true;
});
