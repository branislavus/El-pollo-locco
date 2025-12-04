class MovableObject extends DrawableObject {

    speed = 0.15;
    characterDirectionLeft = false;
    speedY = 0;
    acceleration = 2;
    lastHit = 0;
    collectedBottles = 0;
    collectedCoins = 0;
    jumpAnimationIndex = 0;
    isJumping = false;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };


    /**
     * Applies gravity to the object, making it fall down.
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                if (!this.isAboveGround() && this.speedY <= 0 && this instanceof Character)
                    this.y = 226;
            }
        }, 1000 / 30);
    }


    /**
     * Checks if the object is above ground level.
     * @returns {boolean} True if above ground, else false.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y < 355;
        } else {
            return this.y < 221;
        }
    }


    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
        this.characterDirectionLeft = false;
    }


    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
        if (this instanceof Character)
            this.characterDirectionLeft = true;
    }


    /**
     * Plays an animation by cycling through the given images.
     * @param {string[]} images - Array of image paths.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imagePool[path];
        this.currentImage++;
    }


    /**
     * Plays jump animation once without looping.
     * @param {string[]} images - Array of jump image paths.
     */
    playJumpAnimationOnce(images) {
        this.startPlayJumpAnimationOnce();
        this.continuePlayJumpAnimationOnce(images);
    }


    /**
    * Start animation on first call.
    */
    startPlayJumpAnimationOnce() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpAnimationIndex = 0;
        }
    }


    /**
    * Play through frames once. Stay at last frame if still in air
    */
    continuePlayJumpAnimationOnce(images) {
        if (this.jumpAnimationIndex < images.length) {
            let path = images[this.jumpAnimationIndex];
            this.img = this.imagePool[path];
            this.jumpAnimationIndex++;
        }
    }


    /**
     * Resets jump animation state (call when landing).
     */
    resetJumpAnimation() {
        this.isJumping = false;
        this.jumpAnimationIndex = 0;
    }


    /**
     * Reduces energy when hit and records the time.
     */
    hit() {
        this.energy -= 2;
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.lastHit = new Date().getTime();
    }


    /**
     * Checks if the object is dead.
     * @returns {boolean} True if energy is 0 or less.
     */
    isDead() {
        return this.energy <= 0;
    }


    /**
     * Checks if the object is hurt (recently hit).
     * @returns {boolean} True if hurt within the last 1.5 seconds.
     */
    isHurt() {
        let timePast = new Date().getTime() - this.lastHit;
        timePast = timePast / 1000;
        return timePast < 1.5;
    }


    /**
     * Collects a bottle if colliding with it.
     * @param {Object} bottle - The bottle object to collect.
     */
    collectBottle(bottle) {
        if (!bottle) return;
        if (this.isColliding(bottle))
            this.collectedBottles += 1;
    }


    /**
     * Collects a coin if colliding with it.
     * @param {Object} coin - The coin object to collect.
     */
    collectCoin(coin) {
        if (!coin) return;
        if (this.isColliding(coin))
            this.collectedCoins += 1;
    }


    /**
     * Plays a sound if enough time has passed since the last sound.
     * @param {string} sound - The sound method name to call.
     * @param {number} time - Minimum time in milliseconds between sounds.
     */
    playSoundIfDoingSomething(sound, time) {
        const currentTime = new Date().getTime();
        if (currentTime - this.lastWalkSoundTime > time) {
            this.audio[sound]();
            this.lastWalkSoundTime = currentTime;
        }
    }


    /**
     * Stops the gravity interval.
     */
    stopGravity() {
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
            this.gravityInterval = null;
        }
    }


}