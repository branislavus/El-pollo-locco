let canvas;
let world;
let keyboard = new Keyboard();
let fullscreenFlag = false;
let soundFlag = false;

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
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 68) keyboard.D = false;
});

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

function addTouchButtons() {
    addTouchButton('key-run-right', () => keyboard.RIGHT = true, () => keyboard.RIGHT = false);
    addTouchButton('key-run-left', () => keyboard.LEFT = true, () => keyboard.LEFT = false);
    addTouchButton('key-jump', () => keyboard.UP = true, () => keyboard.UP = false);
    addTouchButton('key-throw', () => keyboard.D = true, () => keyboard.D = false);
}

function fullscreen() {
    const fullscreen = document.getElementById('fullscreen');
    if (!fullscreen) return;
    if (fullscreenFlag) {
        closeFullscreen();
    } else {
        openFullscreen(fullscreen);
    }

}

/* View in fullscreen */
function openFullscreen(fullscreen) {
    if (!fullscreenFlag) {
        fullscreenFlag = true;
        if (fullscreen.requestFullscreen) {
            fullscreen.requestFullscreen();
        } else if (fullscreen.webkitRequestFullscreen) { /* Safari */
            fullscreen.webkitRequestFullscreen();
        } else if (fullscreen.msRequestFullscreen) { /* IE11 */
            fullscreen.msRequestFullscreen();
        }
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (fullscreenFlag) {
        fullscreenFlag = false;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
}

function toggleAllSound() {
    const soundIcon = document.getElementById('toggleAllSound');
    soundFlag = !soundFlag;
    if (soundFlag) {
        audioManager.mute();
        soundIcon.classList.add('toggleAllSoundDisabled');
        soundIcon.classList.remove('toggleAllSoundEnabled');
    } else {
        audioManager.unmute();
        soundIcon.classList.add('toggleAllSoundEnabled');
        soundIcon.classList.remove('toggleAllSoundDisabled');
    }
}