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
    eggs = [];
    lastThrow = 0;
    gameOver = false;
    gameActive = true;
    drawBorderFramesYes = false;
    collisionManager;
    renderer;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initializeManagers();
        this.initializeStatusBars();
        this.renderer.draw();
        this.setWorld();
        this.run();
        this.showMyInterval();
    }

    /**
     * Initializes collision manager and renderer.
     */
    initializeManagers() {
        this.collisionManager = new CollisionManager(this);
        this.renderer = new WorldRenderer(this);
    }

    /**
     * Initializes all status bars including endboss status bar.
     */
    initializeStatusBars() {
        this.statusBarEndboss = new StatusBarEndBoss();
    }

    /**
     * Starts interval to track character movement and trigger bored animation.
     */
    showMyInterval() {
        this.showMyAnimationInterval = setInterval(() => {
            this.character.lastCharacterX = this.character.x;
            this.character.isBored();
        }, 1000);
    }

    /**
     * Checks if endboss status bar should be displayed.
     * @returns {boolean} True if character is close enough to endboss.
     */
    shouldShowEndbossStatusbar() {
        let shouldShow = this.character.x >= 1300;
        return shouldShow;
    }

    /**
     * Starts main game loop checking collisions and game state.
     */
    run() {
        this.runInterval = setInterval(() => {
            if (this.gameOver || this.gameActive === false) return;

            this.handleThrowableObject();
            this.removeFinishedThrowableObjects();
            this.removeFinishedEggs();
            this.checkGameOverConditions();
        }, 200);
    }

    stopWorldIntervals(){
        clearInterval(this.runInterval);
        clearInterval(this.showMyAnimationInterval);
    }

    /**
     * Checks win/lose conditions and triggers game end.
     */
    checkGameOverConditions() {
        if (this.character.energy <= 0 && !loseGame && !winGame)
            this.youLoseTheGame();

        let endboss = this.level.enemies.find(enemy => this.isEndboss(enemy));
        if (endboss && endboss.isDead() && !winGame && !loseGame)
            this.youWonTheGame();
    }

    /**
     * Triggers game over sequence when player loses.
     */
    youLoseTheGame() {
        loseGame = true;
        this.gameOver = true;
        setTimeout(() => {
            endGame();
        }, 4000);
    }

    /**
     * Triggers victory sequence when player wins.
     */
    youWonTheGame() {
        winGame = true;
        this.gameOver = true;
        setTimeout(() => {
            endGame();
        }, 4000);
    }

    /**
     * Removes bottles marked for deletion from throwable objects array.
     */
    removeFinishedThrowableObjects() {
        this.throwableObject = this.throwableObject.filter(obj => !obj.shouldBeRemoved);
    }

    /**
     * Handles bottle throwing action when D key is pressed.
     */
    handleThrowableObject() {
        if (this.canThrow()) {
            let bottle = new ThrowableObject(this.character.x + 40, this.character.y + 60, this.character.characterDirectionLeft);
            this.throwableObject.push(bottle);
            this.lastThrow = new Date().getTime();
            this.collectedBottlesCorrection();
            this.character.lastMove = new Date().getTime();
        }
    }

    /**
     * Checks if character can throw a bottle.
     * @returns {boolean} True if conditions for throwing are met.
     */
    canThrow() {
        return this.keyboard.D && !this.isThrown() && this.character.collectedBottles > 0;
    }

    /**
     * Checks if bottle was recently thrown (cooldown check).
     * @returns {boolean} True if less than 2 seconds since last throw.
     */
    isThrown() {
        let timePast = new Date().getTime() - this.lastThrow;
        timePast = timePast / 1000;
        return timePast < 2;
    }

    /**
     * Decrements collected bottles count and updates status bar.
     */
    collectedBottlesCorrection() {
        this.character.collectedBottles -= 1;
        this.statusBarBottles.setBottlesAmount(this.character.collectedBottles);
    }

    /**
     * Main collision checking coordinator for all collision types.
     */
    checkCollisions() {
        this.collisionManager.checkAllCollisions();
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
     * Resets character Y position to ground level.
     */
    setRightCharecterYPosition() {
        if (this.character.y < 226) this.character.y = 226;
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

    /**
     * Adds a new egg to the world eggs array.
     * @param {Egg} egg - The egg object to add.
     */
    addEgg(egg) {
        this.eggs.push(egg);
    }


    /**
     * Removes eggs that are marked for removal.
     */
    removeFinishedEggs() {
        this.eggs = this.eggs.filter(egg => !egg.shouldBeRemoved);
    }

    /**
     * Handles egg hitting character - cracks egg, deals damage and knocks character back.
     * @param {Egg} egg - The egg that hit the character.
     */
    handleEggHit(egg) {
        egg.crackEgg();
        this.reduceCharacterEnergy(10);
        this.updateHealthBar();

        if (this.checkCharacterDeath()) return;

        this.playHurtSound();
        this.smoothKnockbackCharacter(-40);
    }


    /**
     * Reduces character energy by specified amount.
     * @param {number} damage - Amount of damage to apply.
     */
    reduceCharacterEnergy(damage) {
        this.character.energy -= damage;
        if (this.character.energy < 0)
            this.character.energy = 0;
    }


    /**
     * Updates the health status bar with current character energy.
     */
    updateHealthBar() {
        this.statusBarHealth.setPercentage(this.character.energy);
    }


    /**
     * Checks if character died and triggers death animation.
     * @returns {boolean} True if character died, false otherwise.
     */
    checkCharacterDeath() {
        if (this.character.isDead()) {
            this.character.deadInterval();
            return true;
        }
        return false;
    }


    /**
     * Plays hurt sound effect if audio manager is available.
     */
    playHurtSound() {
        if (typeof audioManager !== 'undefined')
            audioManager.onHurt();
    }


    /**
     * Smoothly knocks character back with animation.
     * @param {number} distance - Distance to push character back.
     */
    smoothKnockbackCharacter(distance) {
        const character = this.character;
        this.initializeKnockback(character);
        const knockbackData = this.calculateKnockbackParameters(character, distance);
        this.startKnockbackAnimation(character, knockbackData);
    }

    /**
     * Initializes knockback state for character.
     * @param {Character} character - Character to initialize knockback for.
     */
    initializeKnockback(character) {
        character.isBeingKnockedBack = true;
        character.movementEnabled = false;
    }

    /**
     * Calculates knockback parameters including start, target positions and duration.
     * @param {Character} character - Character being knocked back.
     * @param {number} distance - Distance to push character back.
     * @returns {Object} Object containing startX, targetX, duration, and startTime.
     */
    calculateKnockbackParameters(character, distance) {
        return {
            startX: character.x,
            targetX: Math.min(character.x + distance, 2200),
            duration: 400,
            startTime: Date.now()
        };
    }

    /**
     * Starts the knockback animation interval.
     * @param {Character} character - Character to animate.
     * @param {Object} knockbackData - Object containing animation parameters.
     */
    startKnockbackAnimation(character, knockbackData) {
        const knockbackInterval = setInterval(() => {
            const progress = this.calculateKnockbackProgress(knockbackData);

            this.updateCharacterPosition(character, knockbackData, progress);
            this.ensureCharacterOnGround(character);

            if (progress >= 1) {
                this.finishKnockback(character, knockbackData.targetX, knockbackInterval);
            }
        }, 1000 / 60);
    }

    /**
     * Calculates current progress of knockback animation.
     * @param {Object} knockbackData - Object containing animation timing data.
     * @returns {number} Progress value between 0 and 1.
     */
    calculateKnockbackProgress(knockbackData) {
        const elapsed = Date.now() - knockbackData.startTime;
        return Math.min(elapsed / knockbackData.duration, 1);
    }

    /**
     * Updates character position based on animation progress.
     * @param {Character} character - Character to update.
     * @param {Object} knockbackData - Object containing position data.
     * @param {number} progress - Current animation progress (0 to 1).
     */
    updateCharacterPosition(character, knockbackData, progress) {
        const easeOut = this.applyEaseOutCubic(progress);
        character.x = knockbackData.startX + (knockbackData.targetX - knockbackData.startX) * easeOut;
    }

    /**
     * Applies ease-out cubic easing function for smooth deceleration.
     * @param {number} progress - Linear progress value (0 to 1).
     * @returns {number} Eased progress value.
     */
    applyEaseOutCubic(progress) {
        return 1 - Math.pow(1 - progress, 3);
    }

    /**
     * Ensures character stays on ground level during knockback.
     * @param {Character} character - Character to check and correct.
     */
    ensureCharacterOnGround(character) {
        if (character.y > 226)
            character.y = 226;
    }

    /**
     * Finishes knockback animation and restores character control.
     * @param {Character} character - Character to restore control to.
     * @param {number} targetX - Final X position.
     * @param {number} knockbackInterval - Interval ID to clear.
     */
    finishKnockback(character, targetX, knockbackInterval) {
        clearInterval(knockbackInterval);
        character.isBeingKnockedBack = false;
        character.movementEnabled = true;
        character.x = targetX;
    }
}