let lastRestartTime = 0;
const RESTART_COOLDOWN = 3000;

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

document.addEventListener('DOMContentLoaded', initializeScreens);

/**
 * Starts the game by initializing level, music, and hiding start screen.
 */
function StartGame() {
    // Stop old audioManager if exists
    if (audioManager) {
        audioManager.stopBackgroundMusic();
    }

    checkSoundState();
    initLevel();
    init();

    setTimeout(() => {
        hideStartWallpaper();
    }, 800);
    loadAudiomanager();
    audioManager.startBackgroundMusic();
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
 * Attaches click and touch event listeners to the start button.
 */
function touchStart() {
    const btn = document.getElementById("startButton");
    if (btn) {
        btn.addEventListener('click', StartGame);
        btn.addEventListener('touchstart', () => {
            StartGame();
        }, { passive: true });
    } else if (this.world.keyboard.ENTER) {

    }
}

document.addEventListener('DOMContentLoaded', touchStart);


/**
 * Attaches click event listeners to the press enter key to restert. lets say its kind of easter egg for developers :-)
 */
document.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        if (!countRestart()) return; // Stop if cooldown active
        stopAllGameAnimations();
        StartGame();
    }
});

/**
 * restart game after the press on button.
 */
function restartGame() {
    if (!countRestart()) return; // Stop if cooldown active
    
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