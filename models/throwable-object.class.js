class ThrowableObject extends MovableObject {

    BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]

    shouldBeRemoved = false;
    soundPlayed = false;
    hasHitEnemy = false;
    splashInterval = null;


    /**
     * Creates a new ThrowableObject instance and initiates the throw.
     * @param {number} x - Starting x position.
     * @param {number} y - Starting y position.
     * @param {boolean} direction - True if throwing left, false if throwing right.
     */
    constructor(x, y, direction) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 44;
        this.throwLeft = direction;
        this.throw();
    }


    /**
     * Initiates the throw animation and physics.
     */
    throw() {
        this.playThrowSound();
        this.initializeThrowPhysics();
        this.startThrowInterval();
    }


    /**
     * Plays the throw sound.
     */
    playThrowSound() {
        if (typeof audioManager !== 'undefined') audioManager.onThrow();
    }


    /**
     * Initializes throw physics.
     */
    initializeThrowPhysics() {
        this.speedY = 30;
        this.applyGravity();
        this.rotationAngle = 0;
    }


    /**
     * Starts the throw movement interval.
     */
    startThrowInterval() {
        this.throwInterval = setInterval(() => {
            this.updateThrowMovement();
        }, 1000 / 60);
    }


    /**
     * Updates throw movement and rotation.
     */
    updateThrowMovement() {
        if (this.isAboveGround()) {
            this.moveBottle();
            this.rotateBottle();
        } else {
            this.handleBottleLanding();
        }
    }


    /**
     * Moves the bottle horizontally.
     */
    moveBottle() {
        this.x += this.throwLeft ? -6 : 6;
    }


    /**
     * Rotates the bottle.
     */
    rotateBottle() {
        this.rotationAngle += 0.1;
    }


    /**
     * Handles bottle landing and starts splash animation.
     */
    handleBottleLanding() {
        clearInterval(this.throwInterval);
        this.startSplashAnimation();
    }


    /**
     * Starts the splash animation and sound.
     */
    startSplashAnimation() {
        this.playBreakSound();
        this.animateSplash()
    }


    /**
     * Plays the bottle break sound once.
     */
    playBreakSound() {
        if (!this.soundPlayed && typeof audioManager !== 'undefined') {
            audioManager.onBottleBreak();
            this.soundPlayed = true;
        }
    }


    /**
     * Animates the splash effect frame by frame.
     */
    animateSplash() {
        let splashIndex = 0;
        this.splashInterval = setInterval(() => {
            if (this.hasMoreSplashFrames(splashIndex)) {
                this.showSplashFrame(splashIndex);
                splashIndex++;
            } else {
                this.splashRemoval();
            }
        }, 80);
    }


    /**
     * Checks if there are more splash frames.
     * @param {number} splashIndex - Current splash frame index.
     * @returns {boolean} True if more frames available.
     */
    hasMoreSplashFrames(splashIndex) {
        return splashIndex < this.BOTTLE_SPLASH.length;
    }


    /**
     * Shows a specific splash frame.
     * @param {number} splashIndex - Splash frame index to display.
     */
    showSplashFrame(splashIndex) {
        this.img = this.imagePool[this.BOTTLE_SPLASH[splashIndex]];
    }


    /**
     * bottle removal after animation.
     */
    splashRemoval() {
        if (this.splashInterval) {
            clearInterval(this.splashInterval);
            this.splashInterval = null;
        }
        this.shouldBeRemoved = true;
    }


    /**
     * Draws the bottle with rotation if in air, or normally if on ground.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        if (this.shouldDrawRotated()) {
            this.drawRotated(ctx);
        } else {
            this.drawNormal(ctx);
        }
    }


    /**
     * Checks if bottle should be drawn rotated.
     * @returns {boolean} True if should be rotated.
     */
    shouldDrawRotated() {
        return this.isAboveGround() && this.rotationAngle !== undefined;
    }


    /**
     * Draws the bottle with rotation.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawRotated(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotationAngle);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }


    /**
     * Draws the bottle normally without rotation.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawNormal(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


}