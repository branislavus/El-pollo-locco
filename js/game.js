let canvas;
let world;
let keyboard = new Keyboard();
let audioManager;
let fullscreenFlag = false;
const touchButtonRegistry = [];
let soundFlag;
const keyMap = {
    ArrowLeft: "LEFT",
    ArrowRight: "RIGHT",
    ArrowUp: "UP",
    ArrowDown: "DOWN",
    " ": "SPACE",
    d: "D",
    D: "D",
    Enter: "ENTER"
};

/**
 * Initializes the game canvas, world, and touch controls.
 */
function init() {
    endProceses();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    addTouchButtons();
}

/**
 * Stop old world if exists to prevent memory leaks
 * Remove old touch buttons to prevent duplicates
 */
function endProceses() {
    if (world) {
        world.stopWorldIntervals();
    }
    removeTouchButtons();
}

/**
 * Handles keyboard input and updates the keyboard state.
 * Maps key names to keyboard properties using the keyMap.
 * Prevents default browser behavior for mapped keys.
 * @param {KeyboardEvent} event - The keyboard event object containing the key pressed.
 * @param {boolean} isDown - True if key is pressed (keydown), false if released (keyup).
 */
function handleKey(event, isDown) {
    const prop = keyMap[event.key];
    if (prop) {
        keyboard[prop] = isDown;
        event.preventDefault();
    }
}

window.addEventListener("keydown", e => handleKey(e, true));
window.addEventListener("keyup", e => handleKey(e, false));

/**
 * Adds touch event listeners to a button element.
 * Handles touchstart, touchend, touchcancel and store events to Registry.
 * @param {string} id - Button element ID.
 * @param {Function} onPress - Callback when button is pressed.
 * @param {Function} onRelease - Callback when button is released.
 * @param {Function} onCancel - Callback when touch is cancelled (defaults to onRelease).
 */
function addTouchButton(id, onPress, onRelease, onCancel = onRelease) {
    const btn = document.getElementById(id);
    if (!btn) return;

    const handleStart = (e) => {
        e.preventDefault();
        onPress();
    };

    const handleEnd = (e) => {
        e.preventDefault();
        onRelease();
    };

    const handleCancel = (e) => {
        e.preventDefault();
        onCancel();
    };

    btn.addEventListener('touchstart', handleStart, { passive: false });
    btn.addEventListener('touchend', handleEnd, { passive: false });
    btn.addEventListener('touchcancel', handleCancel, { passive: false });

    touchButtonRegistry.push({
        id,
        btn,
        handleStart,
        handleEnd,
        handleCancel
    });
}

/**
 * Removes a specific touch button by ID.
 * @param {string} id - Button element ID to remove.
 */
function removeTouchButton(id) {
    const index = touchButtonRegistry.findIndex(entry => entry.id === id);
    if (index === -1) return;

    const { btn, handleStart, handleEnd, handleCancel } = touchButtonRegistry[index];

    btn.removeEventListener('touchstart', handleStart);
    btn.removeEventListener('touchend', handleEnd);
    btn.removeEventListener('touchcancel', handleCancel);

    touchButtonRegistry.splice(index, 1);
}

/**
 * Removes all touch buttons and clears the registry.
 * Prevents memory leaks and duplicate event listeners.
 */
function removeTouchButtons() {
    touchButtonRegistry.forEach(({ btn, handleStart, handleEnd, handleCancel }) => {
        btn.removeEventListener('touchstart', handleStart);
        btn.removeEventListener('touchend', handleEnd);
        btn.removeEventListener('touchcancel', handleCancel);
    });

    touchButtonRegistry.length = 0;
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
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    if (!fullscreen) return;
    if (fullscreenFlag) {
        closeFullscreen();
        fullscreenIcon.classList.add('fullscreenIcon');
        fullscreenIcon.classList.remove('fullscreenIconDisabled');
    } else {
        openFullscreen(fullscreen);
        fullscreenIcon.classList.add('fullscreenIconDisabled');
        fullscreenIcon.classList.remove('fullscreenIcon');
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
    const soundIconDesktop = document.getElementById('toggleAllSoundDesktop');
    soundFlag = !soundFlag;
    if (soundFlag) {
        turnOnMusic(soundIcon);
        turnOnMusic(soundIconDesktop);
        saveSoundState(true);
    } else {
        turnOffMusic(soundIcon);
        turnOffMusic(soundIconDesktop);
        saveSoundState(false);
    }
}

/**
 * Mutes all audio and updates icon to disabled state.
 * @param {HTMLElement} soundIcon - Sound toggle icon element.
 */
function turnOffMusic(soundIcon) {
    if (!audioManager || !soundIcon) return;
    audioManager.mute();
    soundIcon.classList.remove('toggleAllSoundEnabled');
    soundIcon.classList.add('toggleAllSoundDisabled');
}

/**
 * Unmutes all audio and updates icon to enabled state.
 * @param {HTMLElement} soundIcon - Sound toggle icon element.
 */
function turnOnMusic(soundIcon) {
    if (!audioManager || !soundIcon) return;
    audioManager.unmute();
    soundIcon.classList.remove('toggleAllSoundDisabled');
    soundIcon.classList.add('toggleAllSoundEnabled');
}
