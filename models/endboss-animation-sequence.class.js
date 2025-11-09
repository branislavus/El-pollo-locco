class EndbossAnimationSequence {

    /**
     * Creates a new EndbossAnimationSequence instance.
     * @param {Endboss} boss - Reference to the boss instance.
     */
    constructor(boss) {
        this.boss = boss;
    }


    /**
     * Starts the attack animation sequence.
     */
    atackAnimation() {
        if (this.boss.attackInProgress) return;
        this.damageCharacter();
        this.initializeAttack();
        const attackConfig = this.boss.getRandomAttackSettings();
        const startX = this.boss.x;
        this.executeAttackSequence(attackConfig, startX);
    }


    /**
     * Damages the character.
     */
    damageCharacter() {
        this.boss.world.character.energy -= 10;
    }


    /**
     * Initializes attack state.
     */
    initializeAttack() {
        this.boss.attackInProgress = true;
        this.boss.attackPhase = 'moving_left';
    }


    /**
     * Executes the complete attack sequence.
     * @param {Object} config - Attack configuration.
     * @param {number} startX - Starting X position.
     */
    executeAttackSequence(config, startX) {
        const moveLeftInterval = this.startMoveLeftPhase(config.moveSpeed);
        setTimeout(() => {
            clearInterval(moveLeftInterval);
            this.startAttackPhase(config, startX);
        }, config.moveDuration);
    }


    /**
     * Starts the move left phase.
     * @param {number} moveSpeed - Movement speed.
     * @returns {number} Interval ID.
     */
    startMoveLeftPhase(moveSpeed) {
        this.boss.attackPhase = 'moving_left';
        return setInterval(() => {
            if (!this.boss.movementEnabled) return;
            this.moveLeftAndAnimate(moveSpeed);
        }, 1000 / 10);
    }


    /**
     * Moves left and plays animation.
     * @param {number} moveSpeed - Movement speed.
     */
    moveLeftAndAnimate(moveSpeed) {
        this.boss.x -= moveSpeed;
        this.boss.playAnimation(this.boss.IMAGES_WALKING);
        this.boss.playBossWalkSound();
    }


    /**
     * Starts the attack phase.
     * @param {Object} config - Attack configuration.
     * @param {number} startX - Starting X position.
     */
    startAttackPhase(config, startX) {
        this.boss.attackPhase = 'attacking';
        const attackInterval = this.playAttackAnimation();
        this.boss.playBiteSound();
        this.scheduleAttackIntervalStop(attackInterval);
        this.scheduleMoveRightPhase(config, startX);
    }


    /**
     * Plays attack animation.
     * @returns {number} Interval ID.
     */
    playAttackAnimation() {
        return setInterval(() => {
            this.boss.playAnimation(this.boss.IMAGES_ATTACK);
        }, 150);
    }


    /**
     * Schedules stopping of attack interval.
     * @param {number} attackInterval - Interval ID to stop.
     */
    scheduleAttackIntervalStop(attackInterval) {
        setTimeout(() => {
            clearInterval(attackInterval);
        }, 1000);
    }


    /**
     * Schedules the move right phase.
     * @param {Object} config - Attack configuration.
     * @param {number} startX - Starting X position.
     */
    scheduleMoveRightPhase(config, startX) {
        setTimeout(() => {
            setTimeout(() => {
                this.startMoveRightPhase(config.moveSpeed, startX);
            }, config.attackDuration);
        }, 1200);
    }


    /**
     * Starts the move right phase.
     * @param {number} moveSpeed - Movement speed.
     * @param {number} startX - Starting X position.
     */
    startMoveRightPhase(moveSpeed, startX) {
        this.boss.attackPhase = 'moving_right';
        const moveRightInterval = setInterval(() => {
            this.updateMovingRightInterval(moveSpeed, startX, moveRightInterval);
        }, 1000 / 10);
    }


    /**
     * Updates the move right interval.
     * @param {number} moveSpeed - Movement speed.
     * @param {number} startX - Starting X position.
     * @param {number} moveRightInterval - Interval ID.
     */
    updateMovingRightInterval(moveSpeed, startX, moveRightInterval) {
        if (!this.boss.movementEnabled) {
            clearInterval(moveRightInterval);
            return;
        }
        if (this.shouldMoveRight(startX)) {
            this.moveRightAndAnimate(moveSpeed);
        } else {
            this.finishMoveRight(moveRightInterval);
        }
    }


    /**
     * Checks if should continue moving right.
     * @param {number} startX - Starting X position.
     * @returns {boolean} True if should move right.
     */
    shouldMoveRight(startX) {
        return this.boss.x < startX;
    }


    /**
     * Moves right and plays animation.
     * @param {number} moveSpeed - Movement speed.
     */
    moveRightAndAnimate(moveSpeed) {
        this.boss.x += moveSpeed;
        this.boss.playAnimation(this.boss.IMAGES_WALKING);
        this.boss.playBossWalkSound();
    }


    /**
     * Finishes move right phase.
     * @param {number} moveRightInterval - Interval ID.
     */
    finishMoveRight(moveRightInterval) {
        clearInterval(moveRightInterval);
        this.boss.resetAttackState();
    }


    /**
     * Plays hurt animation and sound.
     */
    hurt() {
        if (!this.boss.hurtAnimationStarted) {
            this.startHurtAnimation();
        }
    }


    /**
     * Starts hurt animation sequence.
     */
    startHurtAnimation() {
        this.boss.hurtAnimationStarted = true;
        this.boss.currentImage = 0;
        this.playHurtSound();
        this.takeDamage();
        this.startHurtAnimationInterval();
    }


    /**
     * Plays hurt sound.
     */
    playHurtSound() {
        if (typeof audioManager !== 'undefined')
            audioManager.onBossHurt();
    }


    /**
     * Starts hurt animation interval.
     */
    startHurtAnimationInterval() {
        let hurtInterval = setInterval(() => {
            this.updateHurtAnimation(hurtInterval);
        }, 200);
    }


    /**
     * Updates hurt animation frame.
     * @param {number} hurtInterval - Interval ID.
     */
    updateHurtAnimation(hurtInterval) {
        if (this.hasMoreHurtFrames()) {
            this.playNextHurtFrame();
        } else {
            this.resetHurtAnimation(hurtInterval);
        }
    }


    /**
     * Checks if there are more hurt frames.
     * @returns {boolean} True if more frames available.
     */
    hasMoreHurtFrames() {
        return this.boss.currentImage < this.boss.IMAGES_HURT.length;
    }


    /**
     * Plays next hurt animation frame.
     */
    playNextHurtFrame() {
        let path = this.boss.IMAGES_HURT[this.boss.currentImage];
        this.boss.img = this.boss.imagePool[path];
        this.boss.currentImage++;
    }


    /**
     * Handles damage and schedules counter attack.
     */
    takeDamage() {
        if (!this.boss.attackInProgress) {
            setTimeout(() => {
                this.boss.shouldAttackAfterHurt = true;
            }, 600);
        }
    }


    /**
     * Resets hurt animation state.
     * @param {number} hurtInterval - Interval ID.
     */
    resetHurtAnimation(hurtInterval) {
        clearInterval(hurtInterval);
        this.boss.hurtAnimationStarted = false;
        this.boss.hurtImageIndex = 0;
        this.boss.currentImage = 0;
        this.boss.movementEnabled = true;
    }


    /**
     * Plays death animation sequence.
     */
    dead() {
        if (!this.boss.deathAnimationStarted) {
            this.boss.stopAllMovements();
            this.startDeathAnimationInterval();
        }
    }


    /**
     * Starts death animation interval.
     */
    startDeathAnimationInterval() {
        let deathInterval = setInterval(() => {
            if (this.hasMoreDeathFrames()) {
                this.playNextDeathFrame();
            } else {
                this.finishDeathAnimation(deathInterval);
            }
        }, 200);
    }


    /**
     * Checks if there are more death frames.
     * @returns {boolean} True if more frames available.
     */
    hasMoreDeathFrames() {
        return this.boss.currentImage < this.boss.IMAGES_DEAD.length;
    }


    /**
     * Plays next death animation frame.
     */
    playNextDeathFrame() {
        let path = this.boss.IMAGES_DEAD[this.boss.currentImage];
        this.boss.img = this.boss.imagePool[path];
        this.boss.currentImage++;
    }


    /**
     * Finishes death animation and sets final frame.
     * @param {number} deathInterval - Interval ID.
     */
    finishDeathAnimation(deathInterval) {
        clearInterval(deathInterval);
        this.boss.isDeathAnimationComplete = true;
        this.setLastDeathFrame();
        this.scheduleRemoval();
    }


    /**
     * Sets the last death frame as current image.
     */
    setLastDeathFrame() {
        let lastFrame = this.boss.IMAGES_DEAD[this.boss.IMAGES_DEAD.length - 1];
        this.boss.img = this.boss.imagePool[lastFrame];
    }


    /**
     * Schedules boss removal after delay.
     */
    scheduleRemoval() {
        setTimeout(() => {
            this.boss.shouldBeRemoved = true;
        }, 2000);
    }


}
