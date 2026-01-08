class WorldRenderer {

    /**
     * Creates a new WorldRenderer instance.
     * @param {World} world - Reference to the world instance.
     */
    constructor(world) {
        this.world = world;
        this.ctx = world.ctx;
        this.canvas = world.canvas;
    }

    /**
     * Main rendering loop. Draws all game objects to canvas.
     * Automatically calls itself via requestAnimationFrame.
     */
    draw() {
        this.clearCanvas();
        this.world.checkCollisions();
        this.drawGameWorld();
        this.drawUI();
        this.scheduleNextFrame();
    }

    /**
     * Clears the entire canvas for new frame.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws all game world objects with camera translation.
     */
    drawGameWorld() {
        this.ctx.save();
        this.ctx.translate(this.world.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.restore();
    }

    /**
     * Draws all movable objects in the game world.
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.addObjectsToMap(this.world.level.enemies);
        this.addObjectsToMap(this.world.level.clouds);
        this.addObjectsToMap(this.world.level.bottles);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.eggs);
        this.addToMap(this.world.character);
        this.addObjectsToMap(this.world.throwableObject);
    }

    /**
     * Draws all UI elements (status bars) without camera offset.
     */
    drawUI() {
        this.addToMapUI(this.world.statusBarHealth);
        this.addToMapUI(this.world.statusBarCoins);
        this.addToMapUI(this.world.statusBarBottles);

        if (this.world.statusBarEndboss && this.shouldShowEndbossStatusbar()) {
            this.addToMapUI(this.world.statusBarEndboss);
        }
    }

    /**
     * Checks if endboss status bar should be displayed.
     * @returns {boolean} True if character is close enough to endboss.
     */
    shouldShowEndbossStatusbar() {
        return this.world.character.x >= 1300;
    }

    /**
     * Schedules next animation frame.
     */
    scheduleNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Adds multiple objects to the map for rendering.
     * @param {Array} object - Array of objects to add to map.
     */
    addObjectsToMap(object) {
        object.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds single movable object to canvas with proper orientation.
     * @param {MovableObject} mo - Movable object to add to map.
     */
    addToMap(mo) {
        if (this.isOffScreenSkipObject(mo)) return;
        if (mo.characterDirectionLeft)
            this.flipImage(mo);
        mo.draw(this.ctx);
        this.drawBorderFramesStart(mo);
        if (mo.characterDirectionLeft)
            this.flipImageBack(mo);
    }

    /**
     * Adds UI element to canvas without off-screen culling.
     * Used for status bars that should always be visible.
     * @param {MovableObject} mo - UI object to add to map.
     */
    addToMapUI(mo) {
        if (mo.characterDirectionLeft)
            this.flipImage(mo);
        mo.draw(this.ctx);
        this.drawBorderFramesStart(mo);
        if (mo.characterDirectionLeft)
            this.flipImageBack(mo);
    }

    /**
     * Checks if object is outside visible camera area.
     * @param {MovableObject} mo - Object to check.
     * @returns {boolean} True if object is far off-screen.
     */
    isOffScreenSkipObject(mo) {
        const bufferForSmoothEntry = 200;
        const cameraLeft = -this.world.camera_x;
        const cameraRight = cameraLeft + this.canvas.width;
        
        return mo.x + mo.width < cameraLeft - bufferForSmoothEntry || 
               mo.x > cameraRight + bufferForSmoothEntry;
    }

    /**
     * Draws border frames for debugging if enabled.
     * @param {MovableObject} mo - Object to draw borders for.
     */
    drawBorderFramesStart(mo) {
        if (this.world.drawBorderFramesYes) {
            mo.drawBorderFrames(this.ctx);
            mo.drawOffsetFrames(this.ctx);
        }
    }

    /**
     * Flips image horizontally for left-facing objects.
     * @param {MovableObject} mo - Object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores normal orientation after flipping.
     * @param {MovableObject} mo - Object to restore.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}
