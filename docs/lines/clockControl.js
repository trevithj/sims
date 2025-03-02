import Stopwatch from "../common/stopwatch.js";
const pauseButton = document.querySelector('#pauseButton');
const stopButton = document.querySelector('#stopButton');

const listener = event => console.log(event.elapsedTime);

const { theClock, hand, setState } = Stopwatch({
    listener, 
    // iterations: 20, 
    duration: 500
});
theClock.setAttribute("class", "the-clock");

pauseButton.addEventListener('click', () => {
    if (pauseButton.textContent === 'Resume') {
        setState("unpause");
        pauseButton.innerText = 'Pause';
    } else {
        setState("pause");
        pauseButton.innerText = 'Resume';
    }
});

stopButton.addEventListener('click', () => {
    if(stopButton.textContent==="Stop") {
        setState("stop");
        stopButton.innerText = 'Run';
    } else {
        setState("run");
        stopButton.innerText = 'Stop';
        pauseButton.textContent = 'Pause';
    }
});


// Second hand
hand.addEventListener('animationstart', listener);
hand.addEventListener('animationend', listener);

export default { theClock, ticks: hand };
