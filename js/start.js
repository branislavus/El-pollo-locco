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

function StartGame(){
   
    initLevel(); // Initialisiert das Level
    init(); // Initialisiert die World und startet das Spiel
    setTimeout(() => {
         hideStartWallpaper();
    }, 500);
    console.log('start geklickt!');
}