class Endboss extends MovableObject {

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    currentImage = 0;
    height = 300;
    width = 300;
    speed = 15;
    y = 140;
    bossEnergy = 5;
    hurtImageIndex = 0;
    movementEnabled = true;
    world;
    attackInProgress = false;
    attackPhase = 'idle';
    attackDuration = 1200;
    moveSpeed = 20;
    shouldAttackAfterHurt = false;
    lastWalkSoundTime = 0;
    audio = new AudioManager();
    deathSoundPlayed = false;
    deathAnimationTimeout = null;
    attackSequenceTimeout = null;
    moveRightPhaseTimeout1 = null;
    moveRightPhaseTimeout2 = null;
    attackStopTimeout = null;
    hurtCounterTimeout = null;
    removalTimeout = null;
    eggThrowInterval = null;
    lastEggThrowTime = 0;
    hasGrowled = false;
    timeouts = [
        'deathAnimationTimeout', 'attackSequenceTimeout', 'moveRightPhaseTimeout1',
        'moveRightPhaseTimeout2', 'attackStopTimeout', 'hurtCounterTimeout', 'removalTimeout'
    ];
    static instanceCounter = 0;


    /**
     * Creates a new Endboss instance and initializes all animations.
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.id = ++Endboss.instanceCounter;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2000;
        this.energy = 100;
        this.isDeathAnimationComplete = false;
        this.shouldBeRemoved = false;
        this.hurtAnimationStarted = false;
        this.deathAnimationStarted = false;
        this.animationSequence = new EndbossAnimationSequence(this);
        this.animate();
        this.startEggThrowTimer();
    }


    /**
     * Starts the main animation interval for the endboss.
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this.handleAnimationState();
        }, 200);
    }


    /**
     * Handles the animation state based on priority.
     */
    handleAnimationState() {
        if (this.isDeathAnimationComplete || !this.movementEnabled) return;

        if (this.shouldPlayDeathAnimation()) {
            this.playDeathAnimation();
        } else if (this.shouldPlayHurtAnimation()) {
            this.animationSequence.hurt();
        } else if (this.shouldPlayAttackAnimation()) {

            this.animationSequence.attackAnimation();
        } else if (this.shouldPlayAlertAnimation()) {
            this.alert();
        }
    }


    /**
     * Checks if death animation should play.
     * @returns {boolean} True if should play death animation.
     */
    shouldPlayDeathAnimation() {
        return this.isDead() && !this.isDeathAnimationComplete && !this.deathSoundPlayed;
    }


    /**
     * Plays death sound and schedules death animation.
     */
    playDeathAnimation() {
        if (this.world?.gameOver) return;
        if (typeof audioManager !== 'undefined') audioManager.bossOnDie();
        this.deathSoundPlayed = true;
        this.deathAnimationTimeout = setTimeout(() => {
            this.animationSequence.dead();
        }, 1000);
    }


    /**
     * Checks if hurt animation should play.
     * @returns {boolean} True if should play hurt animation.
     */
    shouldPlayHurtAnimation() {
        return this.isHurt() && !this.isDead() && !this.isDeathAnimationComplete;
    }


    /**
     * Checks if attack animation should play.
     * @returns {boolean} True if should play attack animation.
     */
    shouldPlayAttackAnimation() {
        const shouldAttack = (this.isAttacking() || this.shouldAttackAfterHurt) &&
            !this.attackInProgress &&
            !this.isDead() &&
            !this.isHurt() &&
            !this.isDeathAnimationComplete;

        if (shouldAttack && this.shouldAttackAfterHurt) {
            this.shouldAttackAfterHurt = false;
        }

        return shouldAttack;
    }


    /**
     * Checks if alert animation should play.
     * @returns {boolean} True if should play alert animation.
     */
    shouldPlayAlertAnimation() {
        return !this.isDead() && !this.isHurt() && !this.attackInProgress && !this.isDeathAnimationComplete;
    }


    /**
     * Generates random attack settings.
     * @returns {Object} Attack configuration object.
     */
    getRandomAttackSettings() {
        return {
            moveDuration: Math.floor(Math.random() * 1500) + 1000,
            attackDuration: Math.floor(Math.random() * 400) + 200,
            moveSpeed: Math.floor(Math.random() * 8) + 10
        };
    }


    /**
     * Resets attack state to idle.
     */
    resetAttackState() {
        this.attackInProgress = false;
        this.attackPhase = 'idle';
    }


    /**
     * Checks if boss should attack based on character distance.
     * @returns {boolean} True if should attack.
     */
    isAttacking() {
        if (this.world && this.world.character) {
            let characterX = this.world.character.x;
            let distanceToCharacter = Math.abs(this.x - characterX);
            return distanceToCharacter < 300;
        }
        return false;
    }


    /**
     * Plays walk animation and sound.
     */
    walk() {
        this.playAnimation(this.IMAGES_WALKING);
        this.playBossWalkSound();
    }


    /**
     * Plays boss walk sound if not muted.
     */
    playBossWalkSound() {
        if (this.world?.gameOver) return;
        if (typeof audioManager !== 'undefined') {
            this.playSoundIfDoingSomething('bossOnWalk', 800);
        }
    }


    /**
     * Plays bite sound with delay.
     */
    playBiteSound() {
        if (this.world?.gameOver) return;
        if (typeof audioManager !== 'undefined') audioManager.bossOnBite();
    }

    /**
     * Plays growl sound with delay.
     */
    playGrowlSound() {
        if (this.world?.gameOver) return;
        if (typeof audioManager !== 'undefined') audioManager.bossOnGrowl();
    }


    /**
     * Checks if boss is hurt.
     * @returns {boolean} True if hurt.
     */
    isHurt() {
        return this.hurtImageIndex == 1;
    }


    /**
     * Checks if boss is dead.
     * @returns {boolean} True if dead.
     */
    isDead() {
        return this.bossEnergy <= 0;
    }


    /**
     * Plays alert animation.
     */
    alert() {
        this.playAnimation(this.IMAGES_ALERT);
    }


    /**
     * Stops all boss movements and sets death state.
     */
    stopAllMovements() {
        this.attackInProgress = false;
        this.movementEnabled = false;
        this.deathAnimationStarted = true;
        this.currentImage = 0;
    }


    /**
     * Stops all animations and movements.
     */
    stopAnimations() {
        this.movementEnabled = false;
        this.attackInProgress = false;
        this.shouldAttackAfterHurt = false;
        this.speed = 0;
        this.launchClearIntervals();
        this.launchClearTimeouts();
    }


    /**
     * Clears all active intervals.
     */
    launchClearIntervals() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }

        if (this.eggThrowInterval) {
            clearInterval(this.eggThrowInterval);
            this.eggThrowInterval = null;
        }
    }


    /**
     * Clears all active timeouts.
     */
    launchClearTimeouts() {
        this.timeouts.forEach(timeout => {
            if (this[timeout]) {
                clearTimeout(this[timeout]);
                this[timeout] = null;
            }
        });
    }

    /**
     * Starts interval to throw eggs at random times when not attacking.
     */
    startEggThrowTimer() {
        this.eggThrowInterval = setInterval(() => {
            this.tryThrowEgg();
        }, 1000); // Check every second
    }


    /**
     * Attempts to throw an egg if conditions are met.
     */
    tryThrowEgg() {
        if (!this.world) return;
        this.shoutScream();
        const { currentTime, timeSinceLastEgg, randomThrowInterval } = this.loadParametersThrowEgg();
        if (this.canThrowEgg(timeSinceLastEgg, randomThrowInterval)) {
            this.throwEgg();
            this.lastEggThrowTime = currentTime;
        }
    }


    /**
     * Creates and throws an egg from the endboss position.
     */
    throwEgg() {
        if (this.world) {
            const egg = new Egg(this.x + 100, this.y + 200); // Position at endboss feet
            this.world.addEgg(egg);
        }
    }

    /**
     * Check if character entered boss arena and play growl sound once
     */
    shoutScream() {
        if (this.world?.character && this.world.character.x >= 1290 && !this.hasGrowled) {
            this.playGrowlSound();
            this.hasGrowled = true;
        }
    }

    /**
     * Checks if egg can be thrown based on all conditions.
     * @param {number} timeSinceLastEgg - Time passed since last egg.
     * @param {number} randomThrowInterval - Random interval for this check.
     * @returns {boolean} True if egg can be thrown.
     */
    canThrowEgg(timeSinceLastEgg, randomThrowInterval) {
        return this.world.character.x >= 1300 &&
            !this.attackInProgress &&
            !this.isDead() &&
            timeSinceLastEgg > randomThrowInterval &&
            this.attackPhase === 'idle';
    }

    /**
     * Load parameters for egg throw.
     * @returns {Object} Object containing timing parameters.
     */
    loadParametersThrowEgg() {
        const currentTime = Date.now();
        const timeSinceLastEgg = currentTime - this.lastEggThrowTime;
        const randomThrowInterval = Math.floor(Math.random() * 4000) + 3000;
        return { currentTime, timeSinceLastEgg, randomThrowInterval };
    }


}
