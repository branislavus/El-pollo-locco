let lastRestartTime = 0;
const RESTART_COOLDOWN = 3000;
let lastStartTime = 0;
const START_COOLDOWN = 1000;
let startButtonListenerAttached = false;

/**
 * Hides the start wallpaper and displays the game canvas.
 */
function hideStartWallpaper() {
    const startWallpaper = document.getElementById('startWallpaper');
    const canvas = document.getElementById('canvas');

    if (startWallpaper && canvas) {
        startWallpaper.style.display = 'none';
        canvas.style.display = 'block';
    }

    enableDesktopButtons();
}

/**
 * Shows the start wallpaper and hides the canvas and end screens.
 */
function showStartWallpaper() {
    const startWallpaper = document.getElementById('startWallpaper');
    const canvas = document.getElementById('canvas');
    const endWinWallpaper = document.getElementById('endWinWallpaper');
    const endLoseWallpaper = document.getElementById('endLoseWallpaper');

    hideEndScreens(endWinWallpaper, endLoseWallpaper);
    displayStartScreen(startWallpaper, canvas);
    disableDesktopButtons();
}

/**
 * Hides both end game screens.
 * @param {HTMLElement} endWinWallpaper - Win screen element.
 * @param {HTMLElement} endLoseWallpaper - Lose screen element.
 */
function hideEndScreens(endWinWallpaper, endLoseWallpaper) {
    if (endWinWallpaper) {
        endWinWallpaper.classList.add('d_none');
        endWinWallpaper.style.display = 'none';
    }
    if (endLoseWallpaper) {
        endLoseWallpaper.classList.add('d_none');
        endLoseWallpaper.style.display = 'none';
    }
}

/**
 * Displays the start screen and hides the canvas.
 * @param {HTMLElement} startWallpaper - Start screen element.
 * @param {HTMLElement} canvas - Game canvas element.
 */
function displayStartScreen(startWallpaper, canvas) {
    if (startWallpaper && canvas) {
        canvas.style.display = 'none';
        startWallpaper.style.display = 'flex';
    }
}

/**
 * Initializes screen visibility on page load.
 */
function initializeScreens() {
    const endWinWallpaper = document.getElementById('endWinWallpaper');
    const endLoseWallpaper = document.getElementById('endLoseWallpaper');

    if (endWinWallpaper)
        endWinWallpaper.style.display = 'none';
    if (endLoseWallpaper)
        endLoseWallpaper.style.display = 'none';
}

/**
 * Starts the game by initializing level, music, and hiding start screen.
 */
function StartGame() {
    ifAudioManagerThenStopBackgroundMusic();
    loadAudiomanager();
    checkSoundState();
    initLevel();
    init();

    setTimeout(() => {
        hideStartWallpaper();
    }, 800);
    audioManager.startBackgroundMusic();
}

/**
 * Stop old audioManager if exists
 */
function ifAudioManagerThenStopBackgroundMusic() {
    if (audioManager) {
        audioManager.stopBackgroundMusic();
    }
}

/**
 * Load audiomanager once
 */
function loadAudiomanager() {
    if (!audioManager) {
        audioManager = new AudioManager();
    }
}

/**
 * Hides end game wallpapers (currently empty implementation).
 */
function hideEndgameWallpaper() {
    const endWinWallpaper = document.getElementById('endWinWallpaper');
    const endLoseWallpaper = document.getElementById('endLoseWallpaper');
}

/**
 * Checks if start button cooldown is active.
 * @returns {boolean} True if cooldown expired, false if still active.
 */
function canStartGame() {
    const currentTime = Date.now();
    const timeSinceLastStart = currentTime - lastStartTime;

    if (timeSinceLastStart < START_COOLDOWN)
        return false;

    lastStartTime = currentTime;
    return true;
}

/**
 * Attaches click event listener to the start button.
 * Prevents duplicate StartGame() calls by using only one event type.
 */
function touchStart() {
    const btn = document.getElementById("startButton");
    if (btn && !startButtonListenerAttached) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            if (!canStartGame()) return;
            StartGame();
        }, { passive: false });

        startButtonListenerAttached = true;
    }
}

document.addEventListener('DOMContentLoaded', touchStart);

/**
 * Attaches click event listeners to the press enter key to restart and Stop if cooldown is active.
 */
document.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        if (!countRestart()) return;
        stopAllGameAnimations();
        StartGame();
    }
});

/**
 * restart game after the press on button and Stops if cooldown is active.
 */
function restartGame() {
    if (!countRestart()) return;
    stopAllGameAnimations();
    stopAllSounds();
    StartGame();
}

/**
 * Checks if enough time has passed since last restart.
 * @returns {boolean} True if restart allowed, false if still on cooldown.
 */
function countRestart() {
    const currentTime = Date.now();
    const timeSinceLastRestart = calculateTimeSinceLastRestart(currentTime);

    if (isRestartOnCooldown(timeSinceLastRestart)) {
        logCooldownMessage(timeSinceLastRestart);
        return false;
    }

    updateLastRestartTime(currentTime);
    return true;
}

/**
 * Calculates time elapsed since last restart.
 * @param {number} currentTime - Current timestamp.
 * @returns {number} Milliseconds since last restart.
 */
function calculateTimeSinceLastRestart(currentTime) {
    return currentTime - lastRestartTime;
}

/**
 * Checks if restart is still on cooldown.
 * @param {number} timeSinceLastRestart - Milliseconds since last restart.
 * @returns {boolean} True if cooldown active.
 */
function isRestartOnCooldown(timeSinceLastRestart) {
    return timeSinceLastRestart < RESTART_COOLDOWN;
}

/**
 * Logs remaining cooldown time to console.
 * @param {number} timeSinceLastRestart - Milliseconds since last restart.
 */
function logCooldownMessage(timeSinceLastRestart) {
    const remainingSeconds = Math.ceil((RESTART_COOLDOWN - timeSinceLastRestart) / 1000);
}

/**
 * Updates the last restart timestamp.
 * @param {number} currentTime - Current timestamp.
 */
function updateLastRestartTime(currentTime) {
    lastRestartTime = currentTime;
}

/**
 * Enables desktop action buttons for gameplay.
 * Adds active class to make buttons interactive and fully opaque.
 */
function enableDesktopButtons() {
    const desktopButtons = document.querySelector('.desktop-action-buttons');
    if (desktopButtons) {
        desktopButtons.classList.add('active');
    }
}

/**
 * Disables desktop action buttons on start screen.
 * Removes active class to make buttons non-interactive and semi-transparent.
 */
function disableDesktopButtons() {
    const desktopButtons = document.querySelector('.desktop-action-buttons');
    if (desktopButtons) {
        desktopButtons.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', initializeScreens);
