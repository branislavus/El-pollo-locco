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
        startWallpaper.style.display = 'flex';
        canvas.style.display = 'none';
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
    checkSoundState();
    initLevel();
    init();

    setTimeout(() => {
        hideStartWallpaper();
    }, 800);
    audioManager = new AudioManager();
    audioManager.startBackgroundMusic();
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
        stopAllGameAnimations();
        StartGame();
    }
});