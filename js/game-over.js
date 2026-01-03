let winGame = false;
let loseGame = false;

/**
 * Ends the game, stops all animations and sounds, shows the end screen, and resets everything after a timeout.
 */
function endGame() {
    stopGame();
    showEndAnimation();
    setTimeout(() => {
        hideEndAnimation();
        showStartWallpaper();
        resetGameState();
    }, 8000);
}


/**
 * Resets the global game state variables.
 */
function resetGameState() {
    winGame = false;
    loseGame = false;
}

/**
 * Stops the game, animations, and sounds depending on the game state.
 */
function stopGame() {
    if (winGame || loseGame) {
        stopAllSounds();
        stopAllGameAnimations();
    }
}

/**
 * Stops all animations, movements, and intervals in the game.
 */
function stopAllGameAnimations() {
    setGameOverFlag();
    stopWorldGameLoop();
    stopCharacterAnimations();
    stopEnemyAnimations();
    stopThrowableObjects();
    stopEggAnimations();
    stopCloudAnimations();
    stopCoinAnimations();
    stopCollisionDetection();
    stopWorldRunLoop();
    stopWorldIntervals();
}

/**
 * Stops all world intervals.
 */
function stopWorldIntervals() {
    if (world) {
        world.stopWorldIntervals();
    }
}

/**
 * Stops the world game loop.
 */
function stopWorldGameLoop() {
    if (typeof world !== 'undefined' && world)
        world.gameActive = false;
}

/**
 * Stops all character animations and movements.
 */
function stopCharacterAnimations() {
    if (typeof world !== 'undefined' && world && world.character) {
        world.character.stopAllMovement();
        world.character.disableMovement();
        world.character.movementEnabled = false;
        if (world.character.movementInterval)
            clearInterval(world.character.movementInterval);
        if (world.character.animationInterval)
            clearInterval(world.character.animationInterval);
        if (world.character.stopGravity)
            world.character.stopGravity();
    }
}

/**
 * Stops all enemy animations and movements.
 */
function stopEnemyAnimations() {
    if (typeof world !== 'undefined' && world && world.level && world.level.enemies) {
        world.level.enemies.forEach(enemy => {
            enemy.speed = 0;
            enemy.movementEnabled = false;
            enemy.stopAnimations();
        });
    }
}


/**
 * Removes all throwable objects from the game.
 */
function stopThrowableObjects() {
    if (typeof world !== 'undefined' && world) {
        world.throwableObject = [];
    }
}

/**
 * Stops all egg animations and clears the egg array.
 */
function stopEggAnimations() {
    if (typeof world !== 'undefined' && world && world.eggs) {
        world.eggs.forEach(egg => {
            if (egg.stopRolling)
                egg.stopRolling();
        });
        world.eggs = [];
    }
}

/**
 * Stops all cloud animations and clears the cloud array.
 */
function stopCloudAnimations() {
    if (typeof world !== 'undefined' && world && world.level && world.level.clouds) {
        world.level.clouds.forEach(cloud => {
            if (cloud.stopCloudAnimation)
                cloud.stopCloudAnimation();
        });
        world.level.clouds = [];
    }
}

/**
 * Stops all coin shine animations.
 */
function stopCoinAnimations() {
    if (typeof world !== 'undefined' && world && world.level && world.level.coins) {
        world.level.coins.forEach(coin => {
            if (coin.stopShineCoinsInterval)
                coin.stopShineCoinsInterval();
        });
    }
}

/**
 * Stops collision detection in the game.
 */
function stopCollisionDetection() {
    if (typeof world !== 'undefined' && world && world.collisionInterval)
        clearInterval(world.collisionInterval);
}

/**
 * Stops the world run loop (e.g., for collisions).
 */
function stopWorldRunLoop() {
    if (typeof world !== 'undefined' && world && world.runInterval)
        clearInterval(world.runInterval);
}

/**
 * Sets the flag that the game is over.
 */
function setGameOverFlag() {
    if (typeof world !== 'undefined' && world)
        world.gameOver = true;
}

/**
 * Stops all sounds in the game (global, character, endboss, browser audio).
 */
function stopAllSounds() {
    stoppGlobalAudioManager();
    stoppCharacterAudio();
    stoppEnemiesAudio();
    stoppallAudioImBrowser();
}

/**
 * Stops all audio elements in the browser (fallback).
 * Removes src to free up WebMediaPlayer resources.
 */
function stoppallAudioImBrowser() {
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audio.load();
    });
}

/**
 * Stops all endboss sounds.
 * Removes src to free up WebMediaPlayer resources.
 */
function stoppEnemiesAudio() {
    if (typeof world !== 'undefined' && world && world.level && world.level.enemies) {
        world.level.enemies.forEach(enemy => {
            if (enemy.audio && enemy.audio.sounds) {
                Object.values(enemy.audio.sounds).forEach(audio => {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.src = '';
                    audio.load();
                });
            }
        });
    }
}

/**
 * Stops all character sounds.
 * Removes src to free up WebMediaPlayer resources.
 */
function stoppCharacterAudio() {
    if (typeof world !== 'undefined' && world && world.character && world.character.audio) {
        Object.values(world.character.audio.sounds).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
            audio.load();
        });
    }
}

/**
 * Stops all global sounds from the AudioManager.
 * This includes endboss, egg, and all other global game sounds.
 * Removes src to free up WebMediaPlayer resources.
 */
function stoppGlobalAudioManager() {
    if (typeof audioManager !== 'undefined' && audioManager) {
        Object.values(audioManager.sounds).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
            audio.load();
        });
    }
}

/**
 * Shows the end animation (win/lose screen).
 */
function showEndAnimation() {
    if (winGame) {
        showWinScreen();
    } else if (loseGame) {
        showLoseScreen();
    }
}

/**
 * Shows the win screen.
 */
function showWinScreen() {
    let winWallpaper = document.getElementById('endWinWallpaper');
    if (winWallpaper) {
        winWallpaper.classList.remove('d_none');
        winWallpaper.style.display = 'flex';
    }
}

/**
 * Shows the lose screen.
 */
function showLoseScreen() {
    let loseWallpaper = document.getElementById('endLoseWallpaper');
    if (loseWallpaper) {
        loseWallpaper.classList.remove('d_none');
        loseWallpaper.style.display = 'flex';
    }
}

/**
 * Hides the end animation (both screens).
 */
function hideEndAnimation() {
    hideWinScreen();
    hideLoseScreen();
}

/**
 * Hides the win screen.
 */
function hideWinScreen() {
    let winWallpaper = document.getElementById('endWinWallpaper');
    if (winWallpaper) {
        winWallpaper.classList.add('d_none');
        winWallpaper.style.display = 'none';
    }
}

/**
 * Hides the lose screen.
 */
function hideLoseScreen() {
    let loseWallpaper = document.getElementById('endLoseWallpaper');
    if (loseWallpaper) {
        loseWallpaper.classList.add('d_none');
        loseWallpaper.style.display = 'none';
    }
}
