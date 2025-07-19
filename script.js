// DOM Element References
const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const lapBtn = document.getElementById('lap-btn');
const lapsList = document.getElementById('laps-list');

// Stopwatch State
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let lapCounter = 1;
let lastDisplayedSeconds = -1;

/**
 * Formats time in milliseconds to HH:MM:SS format.
 * @param {number} time - The time in milliseconds.
 * @returns {string} The formatted time string.
 */
function formatTime(time) {
    const date = new Date(time);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Updates the time display element, only changing the DOM when the seconds change.
 */
function updateDisplay() {
    const currentTotalSeconds = Math.floor(elapsedTime / 1000);
    if (currentTotalSeconds !== lastDisplayedSeconds) {
        timeDisplay.textContent = formatTime(elapsedTime);
        lastDisplayedSeconds = currentTotalSeconds;
    }
}

/**
 * Renders the placeholder message in the laps list when it's empty.
 */
function showEmptyLapMessage() {
    lapsList.innerHTML = '<div id="lap-placeholder" class="text-center text-gray-500 italic">No laps recorded yet.</div>';
}

/**
 * The main timer loop. Calculates elapsed time and updates the display.
 */
function runTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    updateDisplay();
}

/**
 * Starts the stopwatch.
 */
function start() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(runTimer, 100); // Update check every 100ms
        isRunning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        lapBtn.disabled = false;
        resetBtn.disabled = false;
    }
}

/**
 * Stops or pauses the stopwatch.
 */
function stop() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        lapBtn.disabled = true;
    }
}

/**
 * Resets the stopwatch to its initial state.
 */
function reset() {
    stop();
    elapsedTime = 0;
    lapCounter = 1;
    lastDisplayedSeconds = -1; // Reset the display cache
    updateDisplay();
    showEmptyLapMessage();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    lapBtn.disabled = true;
}

/**
 * Records a lap time.
 */
function lap() {
    if (isRunning) {
        // Remove placeholder if it exists
        const placeholder = document.getElementById('lap-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const lapTime = formatTime(elapsedTime);
        const lapElement = document.createElement('div');
        lapElement.className = 'flex justify-between items-center bg-gray-700/50 p-2 rounded-md animate-fade-in';
        
        const lapNumberEl = document.createElement('span');
        lapNumberEl.className = 'font-medium text-cyan-300';
        lapNumberEl.textContent = `Lap ${lapCounter}`;
        
        const lapTimeEl = document.createElement('span');
        lapTimeEl.className = 'font-mono';
        lapTimeEl.textContent = lapTime;

        lapElement.appendChild(lapNumberEl);
        lapElement.appendChild(lapTimeEl);

        lapsList.prepend(lapElement); // Add new lap to the top
        lapCounter++;
    }
}

// Event Listeners
startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

// Initial State
stopBtn.disabled = true;
lapBtn.disabled = true;
updateDisplay();
showEmptyLapMessage();
