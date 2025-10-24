function hideStartWallpaper() {
    const startWallpaper = document.getElementById('startWallpaper');
    const canvas = document.getElementById('canvas');

    if (startWallpaper && canvas) {
        startWallpaper.style.display = 'none';
        canvas.style.display = 'block';
    }
}

function showStartWallpaper() {
    const startWallpaper = document.getElementById('startWallpaper');
    const canvas = document.getElementById('canvas');
    const endWinWallpaper = document.getElementById('endWinWallpaper');
    const endLoseWallpaper = document.getElementById('endLoseWallpaper');

    // Verstecke End-Screens
    if (endWinWallpaper) {
        endWinWallpaper.classList.add('d_none');
        endWinWallpaper.style.display = 'none';
    }
    if (endLoseWallpaper) {
        endLoseWallpaper.classList.add('d_none');
        endLoseWallpaper.style.display = 'none';
    }

    // Zeige Start-Wallpaper
    if (startWallpaper && canvas) {
        startWallpaper.style.display = 'flex';
        canvas.style.display = 'none';
    }
}

// Initialisiere beim Laden der Seite
function initializeScreens() {
    const endWinWallpaper = document.getElementById('endWinWallpaper');
    const endLoseWallpaper = document.getElementById('endLoseWallpaper');

    // Stelle sicher, dass End-Screens versteckt sind
    if (endWinWallpaper) {
        endWinWallpaper.style.display = 'none';
    }
    if (endLoseWallpaper) {
        endLoseWallpaper.style.display = 'none';
    }
}

// Führe Initialisierung aus sobald DOM geladen ist
document.addEventListener('DOMContentLoaded', initializeScreens);

function StartGame() {
    // audioManager.startBackgroundMusic();

    initLevel();
    init();
    setTimeout(() => {
        hideStartWallpaper();
    }, 500);
}

function hideEndgameWallpaper() {
    const endWinWallpaper = document.getElementById('endWinWallpaper');
    const endLoseWallpaper = document.getElementById('endLoseWallpaper');

}

function touchStart() {
    const btn = document.getElementById("startButton");
    if (btn) {
        btn.addEventListener('click', StartGame);
        btn.addEventListener('touchstart', () => {
            StartGame();
        }, { passive: true });
    }
}

document.addEventListener('DOMContentLoaded', touchStart);