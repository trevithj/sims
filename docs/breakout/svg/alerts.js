import {subscribe} from "../../pubsub";

export function setupAlerts({svg}) {
    let score = 0;
    const scoreTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    scoreTxt.setAttribute("x", 20);
    scoreTxt.setAttribute("y", 20);
    scoreTxt.textContent = `Score: ${score}`;
    svg.append(scoreTxt);

    const msgTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    msgTxt.setAttribute("x", 100);
    msgTxt.setAttribute("y", 220);
    svg.append(msgTxt);
    
    window.TEST = scoreTxt;
    
    subscribe("BRICK_HIT", () => {
        score += 1;
        scoreTxt.textContent = `Score: ${score}`;
    });
    
    subscribe("GAME_OVER", () => {
        scoreTxt.textContent = `Score: ${score}`;
        msgTxt.textContent = "You lose. GAME OVER";
    })
    subscribe("YOU_WIN", () => {
        scoreTxt.textContent = `Score: ${score}`;
        msgTxt.textContent = "YOU WIN!! CONGRATULATIONS";
    })

}
