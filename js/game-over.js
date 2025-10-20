function endGame(){
    stopGame();
    showEndAnimation();
    setTimeout(() => {
        showStartWallpaper();
    }, 3000); // Zeige End-Animation 3 Sekunden lang
}

function stopGame(){
    if(winGame){
        // Stoppe alle Game-Animationen
        stopAllGameAnimations();
        // Stoppe alle Sounds
        stopAllSounds();
        console.log("Game Won! 🎉");
    }
    if(loseGame){
        // Stoppe alle Game-Animationen  
        stopAllGameAnimations();
        // Stoppe alle Sounds
        stopAllSounds();
        console.log("Game Over! 💀");
    }
}

function stopAllGameAnimations(){
    // Stoppe World-Game-Loop
    if(typeof world !== 'undefined' && world) {
        world.gameActive = false;
        
        // Stoppe Character
        if(world.character) {
            world.character.stopAllMovement();
            world.character.disableMovement();
        }
        
        // Stoppe alle Enemies
        if(world.level && world.level.enemies) {
            world.level.enemies.forEach(enemy => {
                if(enemy.stopAnimations) enemy.stopAnimations();
            });
        }
        
        // Stoppe alle Throwable Objects
        world.throwableObject = [];
    }
}

function stopAllSounds(){
    if(typeof audioManager !== 'undefined' && audioManager) {
        // Stoppe alle laufenden Sounds
        Object.values(audioManager.sounds).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
}

function showEndAnimation(){
    
}

