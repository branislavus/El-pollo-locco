class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBarHealth();
    statusBarCoins = new StatusBarCoins();
    statusBarBottles = new StatusBarBottles();
    statusBarEndboss = null;
    throwableObject = [];
    lastThrow = 0;
    gameOver = false;
    gameActive = true;
    drawBorderFramesYes = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initializeStatusBars();
        this.draw();
        this.setWorld();
        this.run();
        this.showMyInterval();
    }

    initializeStatusBars() {
        this.statusBarEndboss = new StatusBarEndBoss();
    }

    showMyInterval() {
        setInterval(() => {
            this.character.lastCharacterX = this.character.x;
            this.character.isBored();
        }, 1000);
    }

    shouldShowEndbossStatusbar() {
        let shouldShow = this.character.x >= 1300;
        return shouldShow;
    }

    run() {
        this.runInterval = setInterval(() => {
            // Stoppe alle Verarbeitungen wenn Spiel vorbei ist
            if (this.gameOver || this.gameActive === false) return;

            this.checkCollisions();
            this.handleThrowableObject();
            this.removeFinishedThrowableObjects();
            this.checkGameOverConditions();
        }, 200);
    }

    checkGameOverConditions() {
        // Prüfe Character Tod
        if (this.character.energy <= 0 && !loseGame && !winGame)
            this.youLoseTheGame();

        // Prüfe Endboss Tod
        let endboss = this.level.enemies.find(enemy => this.isEndboss(enemy));
        if (endboss && endboss.isDead() && !winGame && !loseGame)
            this.youWonTheGame();
    }

    youLoseTheGame() {
        loseGame = true;
        setTimeout(() => {
            endGame();
        }, 6000); // 1 Sekunde Verzögerung für Death-Animation
    }

    youWonTheGame() {
        winGame = true;
        setTimeout(() => {
            endGame();
        }, 4000); // 2 Sekunden Verzögerung für Death-Animation
    }

    removeFinishedThrowableObjects() {
        this.throwableObject = this.throwableObject.filter(obj => !obj.shouldBeRemoved);
    }

    handleThrowableObject() {
        if (this.canThrow()) {
            let bottle = new ThrowableObject(this.character.x + 40, this.character.y + 60, this.character.characterDirectionLeft);
            this.throwableObject.push(bottle);
            this.lastThrow = new Date().getTime();
            this.collectedBottlesCorrection();
        }
    }

    canThrow() {
        return this.keyboard.D && !this.isThrown() && this.character.collectedBottles > 0;
    }

    isThrown() {
        let timePast = new Date().getTime() - this.lastThrow;
        timePast = timePast / 1000;
        return timePast < 2;
    }

    collectedBottlesCorrection() {
        this.character.collectedBottles -= 1;
        this.statusBarBottles.setBottlesAmount(this.character.collectedBottles);
    }

    checkCollisions() {
        // Stop enemy collisions if game is over
        if (!this.gameActive || this.gameOver || loseGame || winGame) return;
        this.checkEnemyCollisions();
        this.checkBottleEnemyCollisions();
        this.checkBottlesCollisions();
        this.checkCoinsCollisions();
    }

    checkEnemyCollisions() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            let enemy = this.level.enemies[i];
            if (enemy.isDead() || !this.character.isColliding(enemy)) continue;

            this.isJumpingOnEnemy(enemy) ? this.killEnemy(enemy, i) : this.damageCharacter();
            if (!this.character.isAboveGround())
                this.setRightCharecterYPosition();
        }
    }

    setRightCharecterYPosition() {
        if (this.character.y < 226) this.character.y = 226;
    }

    /**
     * Checks collisions between all bottles and enemies.
     */
    checkBottleEnemyCollisions() {
        this.throwableObject.forEach(bottle => {
            this.level.enemies.forEach(enemy => {
                if (this.shouldSkipCollisionCheck(enemy, bottle)) return;
                if (this.isBottleCollidingWithEnemy(bottle, enemy))
                    this.handleBottleHitEnemy(enemy, bottle);
            });
        });
    }

    /**
     * Checks if collision check should be skipped.
     * @param {MovableObject} enemy - Enemy to check.
     * @param {ThrowableObject} bottle - Bottle to check.
     * @returns {boolean} True if collision check should be skipped.
     */
    shouldSkipCollisionCheck(enemy, bottle) {
        return enemy.isDead() || bottle.shouldBeRemoved;
    }

    /**
     * Checks if bottle is colliding with enemy using center point detection.
     * @param {ThrowableObject} bottle - Bottle to check collision for.
     * @param {MovableObject} enemy - Enemy to check collision with.
     * @returns {boolean} True if bottle center hits enemy bounds.
     */
    isBottleCollidingWithEnemy(bottle, enemy) {
        const bottleCenter = this.getBottleCenter(bottle);
        const enemyBounds = this.getEnemyBounds(enemy);

        return this.isPointInBounds(bottleCenter, enemyBounds);
    }

    /**
     * Gets bottle center coordinates.
     * @param {ThrowableObject} bottle - Bottle to get center for.
     * @returns {Object} Center coordinates with x and y.
     */
    getBottleCenter(bottle) {
        return {
            x: bottle.x + bottle.width / 2,
            y: bottle.y + bottle.height / 2
        };
    }

    /**
     * Gets enemy collision bounds with margin for endboss.
     * @param {MovableObject} enemy - Enemy to get bounds for.
     * @returns {Object} Bounds with left, right, top, bottom.
     */
    getEnemyBounds(enemy) {
        const margin = this.isEndboss(enemy) ? 50 : 0;
        return {
            left: enemy.x + margin,
            right: enemy.x + enemy.width - margin,
            top: enemy.y + margin,
            bottom: enemy.y + enemy.height - margin
        };
    }

    /**
     * Checks if point is within bounds.
     * @param {Object} point - Point with x and y coordinates.
     * @param {Object} bounds - Bounds with left, right, top, bottom.
     * @returns {boolean} True if point is inside bounds.
     */
    isPointInBounds(point, bounds) {
        return point.x > bounds.left &&
            point.x < bounds.right &&
            point.y > bounds.top &&
            point.y < bounds.bottom;
    }

    /**
     * Handles collision between bottle and enemy.
     * @param {MovableObject} enemy - Enemy that was hit.
     * @param {ThrowableObject} bottle - Bottle that hit the enemy.
     */
    handleBottleHitEnemy(enemy, bottle) {
        this.applyDamageToEnemy(enemy);
        this.triggerBottleSplash(bottle);
    }

    /**
     * Applies appropriate damage to enemy based on type.
     * @param {MovableObject} enemy - Enemy to damage.
     */
    applyDamageToEnemy(enemy) {
        if (this.isEndboss(enemy)) {
            this.hurtEndboss(enemy);
        } else {
            this.killEnemyByBottle(enemy);
        }
    }

    /**
     * Triggers bottle splash animation if not already removed.
     * @param {ThrowableObject} bottle - Bottle to trigger splash for.
     */
    triggerBottleSplash(bottle) {
        if (!bottle.shouldBeRemoved) {
            bottle.startSplashAnimation();
        }
    }

    /**
     * Checks if enemy is an endboss.
     * @param {MovableObject} enemy - Enemy to check.
     * @returns {boolean} True if enemy is endboss.
     */
    isEndboss(enemy) {
        return enemy.constructor.name === 'Endboss' || enemy.isEndboss === true;
    }

    /**
     * Kills enemy hit by bottle with animation and sound.
     * @param {MovableObject} enemy - Enemy to kill.
     */
    killEnemyByBottle(enemy) {
        this.animateDeadChicken(enemy);
        this.playSoundDeadChicken();
        this.removeDeadEnemy(enemy);
    }

    /**
     * Removes dead enemy from enemies array after delay.
     * @param {MovableObject|number} enemyOrIndex - Enemy object or index to remove.
     */
    removeDeadEnemy(enemyOrIndex) {
        setTimeout(() => {
            let index = typeof enemyOrIndex === 'number'
                ? enemyOrIndex
                : this.level.enemies.indexOf(enemyOrIndex);
            if (index > -1) this.level.enemies.splice(index, 1);
        }, 2000);
    }

    /**
     * Applies damage to endboss and triggers hurt animation.
     * @param {Endboss} endboss - Endboss to damage.
     */
    hurtEndboss(endboss) {
        if (endboss.bossEnergy > 0) {
            endboss.bossEnergy -= 1;
            endboss.hurtImageIndex = 1;
            this.refreshStatusbarEndboss(endboss);
        }
    }

    /**
     * Updates endboss status bar with current energy.
     * @param {Endboss} endboss - Endboss to update status bar for.
     */
    refreshStatusbarEndboss(endboss) {
        if (this.statusBarEndboss) this.statusBarEndboss.setBossEnergyAmount(endboss.bossEnergy);
    }

    /**
     * Checks if character is jumping on enemy.
     * @param {MovableObject} enemy - Enemy to check collision with.
     * @returns {boolean} True if character is landing on enemy from above.
     */
    isJumpingOnEnemy(enemy) {
        const characterBox = this.getCharacterCollisionBox();
        const enemyBox = this.getEnemyCollisionBox(enemy);

        return this.isValidJumpKill(characterBox, enemyBox);
    }

    /**
     * Gets character collision box with offset.
     * @returns {Object} Character collision boundaries.
     */
    getCharacterCollisionBox() {
        return {
            left: this.character.x + this.character.offset.left,
            right: this.character.x + this.character.width - this.character.offset.right,
            bottom: this.character.y + this.character.height - this.character.offset.bottom
        };
    }

    /**
     * Gets enemy collision box with offset.
     * @param {MovableObject} enemy - Enemy to get collision box for.
     * @returns {Object} Enemy collision boundaries.
     */
    getEnemyCollisionBox(enemy) {
        return {
            left: enemy.x + (enemy.offset ? enemy.offset.left : 0),
            right: enemy.x + enemy.width - (enemy.offset ? enemy.offset.right : 0),
            top: enemy.y + (enemy.offset ? enemy.offset.top : 0)
        };
    }

    /**
     * Validates if jump kill conditions are met.
     * @param {Object} characterBox - Character collision box.
     * @param {Object} enemyBox - Enemy collision box.
     * @returns {boolean} True if all jump kill conditions are satisfied.
     */
    isValidJumpKill(characterBox, enemyBox) {
        const isFalling = this.character.speedY <= 0;
        const isLandingOnTop = Math.abs(characterBox.bottom - enemyBox.top) <= 50;
        const isAboveEnemy = characterBox.bottom < enemyBox.top + 20;
        const isHorizontallyOverlapping =
            characterBox.right > enemyBox.left &&
            characterBox.left < enemyBox.right;

        return isFalling && isLandingOnTop && isAboveEnemy && isHorizontallyOverlapping;
    }

    /**
     * Kills enemy when character jumps on it.
     * @param {MovableObject} enemy - Enemy to kill.
     * @param {number} index - Enemy index in array.
     */
    killEnemy(enemy, index) {
        this.character.speedY = 10;
        this.turnOffEnemySound(enemy);
        this.animateDeadChicken(enemy);
        this.playSoundDeadChicken();
        this.removeDeadEnemy(index);
    }

    /**
     * Plays chicken death sound.
     */
    playSoundDeadChicken() {
        if (typeof audioManager !== 'undefined') audioManager.onChickenSquish();
    }

    /**
     * Triggers death animation for chicken enemy.
     * @param {MovableObject} enemy - Enemy to animate.
     */
    animateDeadChicken(enemy) {
        if (enemy.showDeadChicken) enemy.showDeadChicken();
    }

    /**
     * Stops all audio for the given enemy.
     * @param {MovableObject} enemy - Enemy whose sounds should be stopped.
     */
    turnOffEnemySound(enemy) {
        if (enemy.audio && enemy.audio.sounds) {
            Object.values(enemy.audio.sounds).forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        }
    }

    /**
     * Applies damage to character when hit by enemy.
     * Updates health status bar and plays hurt sound.
     */
    damageCharacter() {
        if (!this.character.isHurt()) {
            this.character.hit();
            if (typeof audioManager !== 'undefined') audioManager.onHurt();
            this.statusBarHealth.setPercentage(this.character.energy);
        }
    }

    /**
     * Checks for collisions between character and bottles.
     */
    checkBottlesCollisions() {
        this.checkCollectableCollisions(this.level.bottles, 'collectBottle', this.statusBarBottles, 'setBottlesAmount', 'collectedBottles');
    }

    /**
     * Checks for collisions between character and coins.
     */
    checkCoinsCollisions() {
        this.checkCollectableCollisions(this.level.coins, 'collectCoin', this.statusBarCoins, 'setCoinsAmount', 'collectedCoins');
    }

    /**
     * Generic collision check for collectable items.
     * @param {Array} items - Array of collectable items.
     * @param {string} collectMethod - Method name to call when collecting.
     * @param {Object} statusBar - Status bar to update.
     * @param {string} statusMethod - Method name for status update.
     * @param {string} counterProperty - Property name for item counter.
     */
    checkCollectableCollisions(items, collectMethod, statusBar, statusMethod, counterProperty) {
        items.forEach((item, index) => {
            if (this.character.isCollidingOffset(item)) {
                this.collectItem(item, index, items, collectMethod);
                this.updateStatusBar(statusBar, statusMethod, counterProperty);
            }
        });
    }

    /**
     * Collects an item and removes it from array.
     * @param {Object} item - Item to collect.
     * @param {number} index - Item index in array.
     * @param {Array} items - Array containing the item.
     * @param {string} collectMethod - Method name to call on character.
     */
    collectItem(item, index, items, collectMethod) {
        this.character[collectMethod](item);
        items.splice(index, 1);
        this.playCollectSound(collectMethod);
    }

    /**
     * Plays sound effect for collected item.
     * @param {string} collectMethod - Method name identifying item type.
     */
    playCollectSound(collectMethod) {
        if (collectMethod === 'collectBottle') {
            if (typeof audioManager !== 'undefined') audioManager.onBottle();
        }
        if (collectMethod === 'collectCoin') {
            if (typeof audioManager !== 'undefined') audioManager.onCoin();
        }
    }

    /**
     * Updates status bar display with current character value.
     * @param {Object} statusBar - Status bar object to update.
     * @param {string} statusMethod - Method name to call on status bar.
     * @param {string} counterProperty - Property name on character to read.
     */
    updateStatusBar(statusBar, statusMethod, counterProperty) {
        statusBar[statusMethod](this.character[counterProperty]);
    }

    /**
     * Main rendering loop. Draws all game objects to canvas.
     * Automatically calls itself via requestAnimationFrame.
     */
    draw() {
        this.clearCanvas();
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
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.restore();
    }

    /**
     * Draws all movable objects in the game world.
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObject);
    }

    /**
     * Draws all UI elements (status bars) without camera offset.
     */
    drawUI() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);

        if (this.statusBarEndboss && this.shouldShowEndbossStatusbar()) {
            this.addToMap(this.statusBarEndboss);
        }
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
        if (mo.characterDirectionLeft)
            this.flipImage(mo);
        mo.draw(this.ctx);
        this.drawBorderFramesStart();
        if (mo.characterDirectionLeft)
            this.flipImageBack(mo);
    }

    /**
     * Draws border frames for debugging if enabled.
     */
    drawBorderFramesStart() {
        if (this.drawBorderFramesYes) {
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

    /**
     * Sets world reference for all interactive objects.
     * Allows objects to communicate with the world.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
        this.level.clouds.forEach(cloud => {
            cloud.setWorld(this);
        });
    }

}