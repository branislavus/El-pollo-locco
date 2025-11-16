class CollisionManager {

    removalScheduled = false;
    cleanupScheduled = false;

    /**
     * Creates a new CollisionManager instance.
     * @param {World} world - Reference to the world instance.
     */
    constructor(world) {
        this.world = world;
        this.jumpKillManager = new CollisionJumpKill(world);
    }

    /**
     * Main collision checking coordinator for all collision types.
     */
    checkAllCollisions() {
        if (!this.world.gameActive || this.world.gameOver || loseGame || winGame) return;
        this.checkEnemyCollisions();
        this.checkBottleEnemyCollisions();
        this.checkBottlesCollisions();
        this.checkCoinsCollisions();
        this.checkEggCollisions();
    }

    /**
     * Checks collisions between character and all enemies.
     * Uses two-phase approach: collect jump-killable enemies first, then execute.
     */
    checkEnemyCollisions() {
        const enemiesToKill = this.jumpKillManager.collectJumpKillableEnemies();
        
        enemiesToKill.length > 0 ?
        this.jumpKillManager.executeJumpKills(enemiesToKill, this):
        this.checkEnemyDamage();
        
        if (!this.world.character.isAboveGround())
            this.setRightCharacterYPosition();
    }


    /**
     * Checks if any enemy should damage the character.
     * Only called when no jump-kill occurred.
     */
    checkEnemyDamage() {
        for (let i = this.world.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.world.level.enemies[i];
            if (enemy.isDead() || !this.world.character.isCollidingOffset(enemy)) continue;
            
            this.damageCharacter();
            break; // Only damage once per frame
        }
    }

    /**
     * Resets character Y position to ground level.
     */
    setRightCharacterYPosition() {
        if (this.world.character.y < 226) this.world.character.y = 226;
    }

    /**
     * Checks collisions between all bottles and enemies.
     */
    checkBottleEnemyCollisions() {
        this.world.throwableObject.forEach(bottle => {
            this.world.level.enemies.forEach(enemy => {
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
        this.stopBottleMovement(bottle);
        this.triggerBottleSplash(bottle);
    }

    /**
     * Stops bottle movement on collision.
     * @param {ThrowableObject} bottle - Bottle to stop.
     */
    stopBottleMovement(bottle) {
        if (bottle.throwInterval) {
            clearInterval(bottle.throwInterval);
            bottle.throwInterval = null;
        }
        bottle.speedY = 0;
        bottle.acceleration = 0;
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
        // Mark enemy for removal instead of using index
        enemy.shouldBeRemoved = true;
        this.scheduleEnemyCleanup();
    }

    /**
     * Schedules cleanup of all marked enemies.
     */
    scheduleEnemyCleanup() {
        if (this.cleanupScheduled) return;

        this.cleanupScheduled = true;
        setTimeout(() => {
            this.cleanupMarkedEnemies();
            this.cleanupScheduled = false;
        }, 2000);
    }

    /**
     * Removes all enemies marked with shouldBeRemoved flag.
     */
    cleanupMarkedEnemies() {
        this.world.level.enemies = this.world.level.enemies.filter(enemy => !enemy.shouldBeRemoved);
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
        if (this.world.statusBarEndboss) this.world.statusBarEndboss.setBossEnergyAmount(endboss.bossEnergy);
    }

    /**
     * Checks if character is jumping on enemy.
    /**
     * Kills enemy when character jumps on it.
     * @param {MovableObject} enemy - Enemy to kill.
     * @param {number} index - Enemy index in array (not used, kept for compatibility).
     * Mark enemy for removal instead of using index
     */
    killEnemy(enemy, index) {
        this.world.character.speedY = 10;
        this.turnOffEnemySound(enemy);
        this.animateDeadChicken(enemy);
        this.playSoundDeadChicken();
        enemy.shouldBeRemoved = true;
        this.scheduleEnemyCleanup();
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
        if (!this.world.character.isHurt()) {
            this.world.character.hit();
            if (typeof audioManager !== 'undefined') audioManager.onHurt();
            this.world.statusBarHealth.setPercentage(this.world.character.energy);
        }
    }

    /**
     * Checks for collisions between character and bottles.
     */
    checkBottlesCollisions() {
        this.checkCollectableCollisions(this.world.level.bottles, 'collectBottle', this.world.statusBarBottles, 'setBottlesAmount', 'collectedBottles');
    }

    /**
     * Checks for collisions between character and coins.
     */
    checkCoinsCollisions() {
        this.checkCollectableCollisions(this.world.level.coins, 'collectCoin', this.world.statusBarCoins, 'setCoinsAmount', 'collectedCoins');
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
            if (this.world.character.isCollidingOffset(item)) {
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
        this.world.character[collectMethod](item);
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
        statusBar[statusMethod](this.world.character[counterProperty]);
    }

    /**
     * Checks collisions between character and eggs thrown by endboss.
     */
    checkEggCollisions() {
        this.world.eggs.forEach((egg, index) => {
            if (!egg.isCracked && this.world.character.isCollidingOffset(egg)) {
                this.world.handleEggHit(egg);
            }
        });
    }
}
