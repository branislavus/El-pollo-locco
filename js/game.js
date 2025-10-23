let canvas;
let world;
let keybord = new Keybord();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keybord);

}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keybord.RIGHT = true
    }
    if (e.keyCode == 37) {
        keybord.LEFT = true
    }
    if (e.keyCode == 32) {
        keybord.SPACE = true
    }
    if (e.keyCode == 38) {
        keybord.UP = true
    }
    if (e.keyCode == 40) {
        keybord.DOWN = true
    }
    if (e.keyCode == 68) {
        keybord.D = true
    }
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keybord.RIGHT = false
    }
    if (e.keyCode == 37) {
        keybord.LEFT = false
    }
    if (e.keyCode == 32) {
        keybord.SPACE = false
    }
    if (e.keyCode == 38) {
        keybord.UP = false
    }
    if (e.keyCode == 40) {
        keybord.DOWN = false
    }
    if (e.keyCode == 68) {
        keybord.D = false
    }
});

function addTouchButton(id, onPress, onRelease) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        onPress();
    });
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        onRelease();
    });
}

addTouchButton('key-run-left', () => keybord.RIGHT = true, () => keybord.RIGHT = false);

addTouchButton('key-run-right', () => keybord.LEFT = true, () => keybord.LEFT = false);

addTouchButton('key-jump', () => keybord.UP = true, () => keybord.UP = false);

addTouchButton('key-throw', () => keybord.D = true, () => keybord.D = false);



function fullscreen() {
    const fullscreen = document.getElementById('fullscreen');
    if (!fullscreen) return;
    if (fullscreenFlag) {
        closeFullscreen();
    } else {
        openFullscreen(fullscreen);
    }

}


let fullscreenFlag = false;

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