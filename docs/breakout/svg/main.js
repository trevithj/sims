import {subscribe} from "../../pubsub";
import {setupBall} from "./ball";
import {setupPaddle} from "./paddle";
// import {drawBricks, brickAt} from "./bricks";

const view = document.getElementById("svg-section");
const svg = view.querySelector("#mySVG");

let drawBall;
let drawPaddle;
let score = 0;
let status = "";

function doAlert(message) {
    alert(message);
}

// Drawing loop
function draw() {
    // drawBricks(svg);
    drawBall();
    // drawScore(svg);
    if (!status) {
        requestAnimationFrame(draw);
    } else {
        doAlert(status);
    }
}

function drawScore(svg) {
    // ctx.font = "16px Arial";
    // ctx.fillStyle = "#0095DD";
    // ctx.fillText(`Score: ${score}`, 8, 20);
}

function startGame() {
    drawPaddle = setupPaddle({svg});
    // drawBall = setupBall({svg, brickAt});
    drawBall = setupBall({svg});

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

view.querySelector(".runButton").addEventListener("click", function () {
    startGame();
    this.disabled = true;
});
