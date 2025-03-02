import Stopwatch from "../common/stopwatch.js";
const pauseButton = document.querySelector('#pauseButton');
const resetButton = document.querySelector('#resetButton');
const clockDiv = document.querySelector('#theClock');
const timerDiv = document.querySelector('#theTimeDisplay');

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

const { theClock, setState } = Stopwatch({
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