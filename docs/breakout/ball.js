import {publish, subscribe} from "../pubsub";

const ballRadius = 10;

export function setupBall({canvas, brickAt}) {
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    let paddleLeft = 0;
    let paddleRight = 0;

    subscribe("PADDLE_MOVED", (data) => {
        paddleLeft = data.left;
        paddleRight = data.right;
    });

    function drawBall(ctx) {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleLeft && x < paddleRight) {
                dy = -dy;
            } else {
                publish("GAME_OVER");
            }
        } else if (brickAt(x,y) !== null) {
            dy = -dy;
        }
        x += dx;
        y += dy;
    }

    return drawBall;
}
