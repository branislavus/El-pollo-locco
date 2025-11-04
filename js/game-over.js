// Global Game State Variables
let winGame = false;
let loseGame = false;

function endGame() {
    stopGame();
    showEndAnimation();
    
    // Nach 10 Sekunden: End-Screens verstecken, dann zum Start und Game State resetten
    setTimeout(() => {
        hideEndAnimation();
        showStartWallpaper();
        resetGameState();
    }, 10000); 
    // Zeige End-Animation 10 Sekunden lang
}


function resetGameState() {
    winGame = false;
    loseGame = false;
}

function stopGame() {
    if (winGame) {
        // Stoppe alle Game-Animationen
        stopAllGameAnimations();
        // Stoppe alle Sounds
        stopAllSounds();
        console.log("Game Won! 🎉");
    }
    if (loseGame) {
        // Stoppe alle Game-Animationen  
        stopAllGameAnimations();
        // Stoppe alle Sounds
        stopAllSounds();
        console.log("Game Over! 💀");
    }
}

function stopAllGameAnimations() {
    // Stoppe World-Game-Loop
    if (typeof world !== 'undefined' && world) {
        world.gameActive = false;

        // Stoppe Character komplett
        if (world.character) {
            world.character.stopAllMovement();
            world.character.disableMovement();
            world.character.movementEnabled = false;

            // Stoppe Character-spezifische Intervals
            if (world.character.movementInterval) {
                clearInterval(world.character.movementInterval);
            }
            if (world.character.animationInterval) {
                clearInterval(world.character.animationInterval);
            }
        }

        // Stoppe alle Enemies komplett
        if (world.level && world.level.enemies) {
            world.level.enemies.forEach(enemy => {
                // Stoppe Bewegung
                enemy.speed = 0;
                enemy.movementEnabled = false;

                // Stoppe Animationen (Chicken)
                if (enemy.constructor && enemy.constructor.name === 'Chicken' && enemy.stopAnimations) {
                    enemy.stopAnimations();
                }

                // Stoppe Animationen (andere Enemies, z.B. Endboss)
                if (enemy.stopAnimations && enemy.constructor.name !== 'Chicken') {
                    enemy.stopAnimations();
                }

                // Stoppe Endboss-spezifische Angriffe
                if (enemy.constructor.name === 'Endboss') {
                    enemy.attackInProgress = false;
                    enemy.shouldAttackAfterHurt = false;
                }
            });
        }

        // Stoppe alle Throwable Objects
        world.throwableObject = [];

        // Stoppe alle Cloud-Animationen
        if (world.level && world.level.clouds) {
            world.level.clouds.forEach(cloud => {
                if (cloud.stopAnimation) {
                    cloud.stopAnimation();
                }
            });
        }
        
        // Stoppe Kollisionserkennung - sehr wichtig!
        if (world.collisionInterval) {
            clearInterval(world.collisionInterval);
        }
        
        // Stoppe World-Run-Loop (Kollisionen, etc.)
        if (world.runInterval) {
            clearInterval(world.runInterval);
        }
        
        // Setze Flag für gestopptes Spiel
        world.gameOver = true;
    }
}

function stopAllSounds() {
    // 1. Stoppe globalen AudioManager
    if (typeof audioManager !== 'undefined' && audioManager) {
        Object.values(audioManager.sounds).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    // 2. Stoppe Character Audio
    if (typeof world !== 'undefined' && world && world.character && world.character.audio) {
        Object.values(world.character.audio.sounds).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    // 3. Stoppe Endboss Audio
    if (typeof world !== 'undefined' && world && world.level && world.level.enemies) {
        world.level.enemies.forEach(enemy => {
            if (enemy.audio && enemy.audio.sounds) {
                Object.values(enemy.audio.sounds).forEach(audio => {
                    audio.pause();
                    audio.currentTime = 0;
                });
            }
        });
    }

    // 4. Stoppe alle Audio-Elemente im Browser (Fallback)
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function showEndAnimation() {
    if (winGame) {
        showWinScreen();
    } else if (loseGame) {
        showLoseScreen();
    }
}

function showWinScreen() {
    // Nutze vorhandenes Win-Wallpaper Element als Overlay
    let winWallpaper = document.getElementById('endWinWallpaper');
    if (winWallpaper) {
        winWallpaper.classList.remove('d_none');
        winWallpaper.style.display = 'flex';
    }

    console.log("🎉 YOU WIN! Endboss defeated!");
}

function showLoseScreen() {
    // Nutze vorhandenes Lose-Wallpaper Element als Overlay
    let loseWallpaper = document.getElementById('endLoseWallpaper');
    if (loseWallpaper) {
        loseWallpaper.classList.remove('d_none');
        loseWallpaper.style.display = 'flex';
    }

    console.log("💀 GAME OVER! Character died!");
}

function hideEndAnimation() {
    // Verstecke Win-Screen
    let winWallpaper = document.getElementById('endWinWallpaper');
    if (winWallpaper) {
        winWallpaper.classList.add('d_none');
        winWallpaper.style.display = 'none';
    }

    // Verstecke Lose-Screen
    let loseWallpaper = document.getElementById('endLoseWallpaper');
    if (loseWallpaper) {
        loseWallpaper.classList.add('d_none');
        loseWallpaper.style.display = 'none';
    }
}
