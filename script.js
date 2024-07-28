let display = document.getElementById('display');
let startStopButton = document.getElementById('startStop');
let pauseButton = document.getElementById('pause');
let resetButton = document.getElementById('reset');
let workoutInput = document.getElementById('interval1');
let restInput = document.getElementById('interval2');
//let logDiv = document.getElementById('log');

let isRunning = false;
let isPaused = false;
let startTime;
let elapsedTime = 0;
let pausedTime = 0;
let workoutInterval;
let restInterval;
let currentInterval;
let timerInterval;
let isWorkout = true; // Flag to track if it's workout or rest period

startStopButton.addEventListener('click', toggleTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

function toggleTimer() {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    isRunning = true;
    isPaused = false;
    startStopButton.textContent = 'Stop';
    pauseButton.disabled = false;
    startTime = Date.now() - pausedTime;
    workoutInterval = parseFloat(workoutInput.value) * 1000 || 30000; // Default 30 seconds
    restInterval = parseFloat(restInput.value) * 1000 || 10000; // Default 10 seconds
    currentInterval = workoutInterval; // Start with workout
    isWorkout = true;
    document.body.style.backgroundColor = '#4CAF50'
    //logDiv.innerHTML = '<p>Workout started!</p>';
    timerInterval = setInterval(updateTimer, 10);
}

function stopTimer() {
    isRunning = false;
    isPaused = false;
    startStopButton.textContent = 'Start';
    pauseButton.textContent = 'Pause';
    pauseButton.disabled = true;
    clearInterval(timerInterval);
    pausedTime = 0;
    //logDiv.innerHTML += '<p>Workout stopped.</p>';
}

function pauseTimer() {
    if (isPaused) {
        // Resume
        isPaused = false;
        pauseButton.textContent = 'Pause';
        startTime = Date.now() - pausedTime;
        timerInterval = setInterval(updateTimer, 10);
       // logDiv.innerHTML += '<p>Workout resumed.</p>';
    } else {
        // Pause
        isPaused = true;
        pauseButton.textContent = 'Resume';
        clearInterval(timerInterval);
        pausedTime = Date.now() - startTime;
       // logDiv.innerHTML += '<p>Workout paused.</p>';
    }
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    pausedTime = 0;
    isWorkout = true;
    display.textContent = '00:00.00';
    document.body.style.backgroundColor = '#f0f0f0'
   // logDiv.innerHTML = '<p>Workout reset.</p>';
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    display.textContent = formatTime(elapsedTime);
    
    if (elapsedTime >= currentInterval) {
        playBeep();
        switchInterval();
    }
}

function switchInterval() {
    isWorkout = !isWorkout;
    if (isWorkout) {
        currentInterval += workoutInterval;
       // logDiv.innerHTML += `<p>Workout period started at ${formatTime(elapsedTime)}</p>`;
        document.body.style.backgroundColor = '#4CAF50';
    } else {
        currentInterval += restInterval;
        document.body.style.backgroundColor = '#FFA500';
       // logDiv.innerHTML += `<p>Rest period started at ${formatTime(elapsedTime)}</p>`;
    }
    logDiv.scrollTop = logDiv.scrollHeight; // Auto-scroll to bottom
}

function formatTime(time) {
    let minutes = Math.floor(time / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    let milliseconds = Math.floor((time % 1000) / 10);
    return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function playBeep() {
    // Create an oscillator
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2); // Beep for 0.2 seconds
}