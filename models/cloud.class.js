class Cloud extends MovableObject {
    height = 200;
    width = 300;
    world;
    leftBorder;
    rightBorder;
    cloudPlayingSound = false;
    cloudTimeout = null;

    /**
     * Creates a new Cloud instance with random position and speed.
     */
    constructor() {
        super();
        this.loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 2000;
        this.y = Math.random() * 50;
        this.speed = 0.05 + Math.random() * 0.2;
    }

    /**
     * Sets the world reference and initializes cloud animation.
     * @param {Object} world - The game world object.
     */
    setWorld(world) {
        this.world = world;
        this.leftBorder = this.world.level.level_start_x;
        this.rightBorder = this.world.level.level_end_x;
        this.animate();
    }

    /**
     * Starts the cloud animation interval for movement and sound.
     */
    animate() {
        this.cloudInterval = setInterval(() => {
            if (this.world?.gameOver) {
                clearInterval(this.cloudInterval);
                return;
            }
            this.returnCloudBack();
            this.moveLeft();
            this.playCoudSound();
        }, 1000 / 60);
    }

    /**
     * Returns the cloud to the right border when it reaches the left border.
     */
    returnCloudBack() {
        if (this.x < this.leftBorder) this.x = this.rightBorder;
    }

    /**
     * Plays wind sound when the cloud is near the character.
     */
    playCoudSound() {
        if (this.world?.gameOver) return;
        const isNearCharacter = Math.abs(this.world.character.x - this.x) < 10;
        if (isNearCharacter && !this.cloudPlayingSound && !audioManager.isMuted) {
            audioManager.onWindGust();
            this.cloudPlayingSound = true;
            this.turnToFalse();
        }
    }

    /**
    * Stops the cloud sound under 5sec.
    */
    turnToFalse() {
        if (this.cloudTimeout) {
            clearTimeout(this.cloudTimeout);
        }
        this.cloudTimeout = setTimeout(() => {
            this.cloudPlayingSound = false;
        }, 5000);
    }

    /**
     * Stops the cloud animation interval.
     */
    stopCloudAnimation() {
        clearInterval(this.cloudInterval);
        if (this.cloudTimeout) {
            clearTimeout(this.cloudTimeout);
            this.cloudTimeout = null;
        }
    }
}