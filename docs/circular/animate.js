import {publish} from "../common/pubsub";

const BaseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
// Create the circle at (0,0), we'll use translate for positioning
BaseCircle.setAttribute('cx', 0);
BaseCircle.setAttribute('cy', 0);
BaseCircle.setAttribute('r', 4);
BaseCircle.setAttribute('fill', "blue");

export function animateCircleTranslate(view) {
    return function doAnimate(start, end, duration, cb) {
        const circle = BaseCircle.cloneNode();

        // Set initial transform
        circle.style.transform = `translate(${start.x}px, ${start.y}px)`;
        circle.style.transition = `transform ${duration}ms linear`;

        view.appendChild(circle);

        // Remove the circle after the transition ends
        circle.addEventListener('transitionend', function handler(e) {
            // if (e.propertyName === 'transform') {
            circle.remove();
            if (typeof cb === "function") {
                cb();
            }
        });

        // Trigger the animation
        void circle.offsetWidth;
        setTimeout(() => {
            circle.style.transform = `translate(${end.x}px, ${end.y}px)`;
        }, 2)
    }
}

function defaultCB(x1, y1) {
    const cx = 50 + Math.round(x1 * 40);
    const cy = 50 + Math.round(y1 * 40);
    return {cx, cy};
}

export function getCirclePoints(n, callback = defaultCB) {
    const points = [];
    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n; // Angle in radians
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        points.push(callback(x, y));
    }
    return points;
}
