import {subscribe} from "../../pubsub";
import {setupBall} from "./ball";
import {setupPaddle} from "./paddle";
import {brickAt, setupBricks} from "./bricks";
import {setupAlerts} from "./alerts";

const view = document.getElementById("svg-section");
const svg = view.querySelector("#mySVG");

let drawBall;
let drawPaddle;
let status = "";

// Drawing loop
function draw() {
    drawBall();
    if (!status) {
        requestAnimationFrame(draw);
    }
}

setupAlerts({svg});

function startGame() {
    setupBricks({svg});
    drawPaddle = setupPaddle({svg});
    drawBall = setupBall({svg, brickAt});

    draw();
    subscribe("GAME_OVER", () => {
        status = "GAME OVER";
    })
    subscribe("YOU_WIN", () => {
        status = "YOU WIN!! CONGRATULATIONS";
    })
}

view.querySelector(".runButton").addEventListener("click", function () {
    startGame();
    this.disabled = true;
});
