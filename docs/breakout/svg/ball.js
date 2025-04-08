import {publish, subscribe} from "../../pubsub";

const ballRadius = 10;

export function setupBall({svg, brickAt}) {
    const bounds = svg.viewBox.baseVal;
    let x = bounds.width / 2;
    let y = bounds.height - 30;
    let dx = 2;
    let dy = -2;
    const paddle = {left: 0, right: 0};

    const ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ball.setAttribute("cx", x);
    ball.setAttribute("cy", y);
    ball.setAttribute("r", ballRadius);
    ball.setAttribute("fill", "#0095DD");
    svg.append(ball);


    subscribe("PADDLE_MOVED", (data) => {
        paddle.left = data.left;
        paddle.right = data.right;
    });

    function drawBall() {
        ball.setAttribute("cx", x);
        ball.setAttribute("cy", y);
        if (x + dx > bounds.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > bounds.height - ballRadius) {
            if (x > paddle.left && x < paddle.right) {
                dy = -dy;
            } else {
                publish("GAME_OVER");
            }
            // } else if (brickAt(x,y) !== null) {
            // dy = -dy;
        }
        x += dx;
        y += dy;
    }

    return drawBall;
}
