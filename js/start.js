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

    if (startWallpaper && canvas) {
        startWallpaper.style.display = 'flex';
        canvas.style.display = 'none';
    }
}

function StartGame() {
    // audioManager.startBackgroundMusic();
    
    initLevel();
    init();
    setTimeout(() => {
        hideStartWallpaper();
    }, 500);
}