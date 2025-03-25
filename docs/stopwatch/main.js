import Stopwatch from "../common/stopwatch.js";
const pauseButton = document.querySelector('#pauseButton');
const resetButton = document.querySelector('#resetButton');
const clockDiv = document.querySelector('#theClock');
const timerDiv = document.querySelector('#theTimeDisplay');
const durationCtrl = document.querySelector('#durationControl');

const data = {
    ticks: 0
}

function displayTime(elapsedTime) {
    timerDiv.innerText = [
        `Elapsed time (seconds): ${elapsedTime}`,
        `Tick count: ${data.ticks}`
    ].join("\n")
}
displayTime(0);

const listener = event => {
    data.ticks += 1;
    displayTime(event.elapsedTime);
}

const { theClock, setState, setDuration } = Stopwatch({
    listener, 
    duration: 500
});

pauseButton.addEventListener('click', () => {
    if (pauseButton.textContent === 'Resume') {
        setState("unpause");
        pauseButton.innerText = 'Pause';
    } else {
        setState("pause");
        pauseButton.innerText = 'Resume';
    }
});

resetButton.addEventListener('click', () => {
    setState("stop");
    displayTime(0);
    pauseButton.innerText = 'Pause';
    setTimeout(() => setState("run"), 0);
});

clockDiv.appendChild(theClock);

// duration control - TODO make stand-alone component?
const durationValue = durationCtrl.querySelector("span");
const durationInput = durationCtrl.querySelector("input");
durationInput.addEventListener("change", evt => {
    const ms = evt.target.value * 100;
    durationValue.textContent = `${ms}ms`;
    setDuration(ms);
})