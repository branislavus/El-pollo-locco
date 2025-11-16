let canvas;
let world;
let keyboard = new Keyboard();
let audioManager;
let fullscreenFlag = false;
let soundFlag = false;

/**
 * Initializes the game canvas, world, and touch controls.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    addTouchButtons();
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 68) keyboard.D = true;
    if (e.keyCode == 13) keyboard.ENTER = true;
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 68) keyboard.D = false;
    if (e.keyCode == 13) keyboard.ENTER = false;
});

/**
 * Adds touch event listeners to a button element.
 * @param {string} id - Button element ID.
 * @param {Function} onPress - Callback when button is pressed.
 * @param {Function} onRelease - Callback when button is released.
 */
function addTouchButton(id, onPress, onRelease) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        onPress();
    }, { passive: false });
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        onRelease();
    }, { passive: false });
}

/**
 * Initializes all touch control buttons.
 */
function addTouchButtons() {
    addTouchButton('key-run-right', () => keyboard.RIGHT = true, () => keyboard.RIGHT = false);
    addTouchButton('key-run-left', () => keyboard.LEFT = true, () => keyboard.LEFT = false);
    addTouchButton('key-jump', () => keyboard.UP = true, () => keyboard.UP = false);
    addTouchButton('key-throw', () => keyboard.D = true, () => keyboard.D = false);
}

/**
 * Toggles fullscreen mode on/off.
 */
function fullscreen() {
    const fullscreen = document.getElementById('fullscreen');
    if (!fullscreen) return;
    if (fullscreenFlag) {
        closeFullscreen();
    } else {
        openFullscreen(fullscreen);
    }
}

/**
 * Opens fullscreen mode with cross-browser support.
 * @param {HTMLElement} fullscreen - Element to display in fullscreen.
 */
function openFullscreen(fullscreen) {
    if (!fullscreenFlag) {
        fullscreenFlag = true;
        if (fullscreen.requestFullscreen) {
            fullscreen.requestFullscreen();
        } else if (fullscreen.webkitRequestFullscreen) {
            fullscreen.webkitRequestFullscreen();
        } else if (fullscreen.msRequestFullscreen) {
            fullscreen.msRequestFullscreen();
        }
    }
}

/**
 * Closes fullscreen mode with cross-browser support.
 */
function closeFullscreen() {
    if (fullscreenFlag) {
        fullscreenFlag = false;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

/**
 * Toggles sound on/off and updates UI icon.
 */
function toggleAllSound() {
    const soundIcon = document.getElementById('toggleAllSound');
    soundFlag = !soundFlag;
    soundFlag ? turnOffMusic(soundIcon) : turnOnMusic(soundIcon);
}

/**
 * Mutes all audio and updates icon to disabled state.
 * @param {HTMLElement} soundIcon - Sound toggle icon element.
 */
function turnOffMusic(soundIcon) {
    audioManager.mute();
    soundIcon.classList.add('toggleAllSoundDisabled');
    soundIcon.classList.remove('toggleAllSoundEnabled');
}

/**
 * Unmutes all audio and updates icon to enabled state.
 * @param {HTMLElement} soundIcon - Sound toggle icon element.
 */
function turnOnMusic(soundIcon) {
    audioManager.unmute();
    soundIcon.classList.add('toggleAllSoundEnabled');
    soundIcon.classList.remove('toggleAllSoundDisabled');
}