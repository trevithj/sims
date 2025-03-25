function construct({duration = 1000, iterations = "infinite", listener}) {
    const theClock = document.createElement("div");
    theClock.innerHTML = `
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes spin {
            from { transform: rotate(0deg) }
            to { transform: rotate(360deg) }
        }
        .hand {
            transform: translate(8px, 8px);
            stroke-linecap: round;
            stroke-width: 0.6;
            stroke: red;
        }
        .running {
            animation-duration: ${duration}ms;
            animation-name: spin;
            animation-timing-function: linear;
            animation-iteration-count: ${iterations};
        }
        .ticks { stroke: silver; }
      </style>
    
      <circle cx="8" cy="8" fill="#ddd" r="6" stroke="none"/>
      <path d="M2,8 L4,8 M12,8 L14,8 M8,2 L8,4 M8,12 L8,14" stroke="#aaa" stroke-width="0.5"/>
      <circle cx="8" cy="8" fill="none" r="6" stroke-width="0.5" stroke="black"/>
      <g class="hand">
        <line x1="0" y1="0" x2="0" y2="-5" />
        <circle cx="0" cy="0" r="1" />
      </g>
      <path d="M3 7C3 5 5 3 7 3 5 3 3 5 3 7" stroke="#fff" stroke-opacity="0.8" stroke-linecap="round" />
    </svg>`;
      
    const hand = theClock.querySelector(".hand > line");
    const { style } = hand;
    const setState = (state) => {
        console.log(state);
        switch(state) {
            case "pause": return style.animationPlayState = "paused";
            case "unpause": return style.animationPlayState = "running";
            case "run": {
                style.animationPlayState = "running"
                return hand.classList.add("running");
            }
            case "stop": return hand.classList.remove("running");
            default: return;
        }
    };
    const setDuration = ms => {
        hand.style.animationDuration = `${ms}ms`;
    }
    // window.TEST = { hand, setState };
    hand.addEventListener('animationiteration', listener);

    return {theClock, hand, setState, setDuration};
}

export default construct;
