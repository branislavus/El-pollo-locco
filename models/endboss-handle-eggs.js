/**
 * Handles all egg-throwing functionality for the Endboss.
 * Manages egg spawning, timing, and conditions for throwing eggs.
 */
class EndbossHandleEggs {
    constructor(endboss) {
        this.endboss = endboss;
        this.eggThrowInterval = null;
        this.lastEggThrowTime = 0;
    }

    /**
     * Starts interval to throw eggs at random times when not attacking.
     */
    startEggThrowTimer() {
        this.eggThrowInterval = setInterval(() => {
            this.tryThrowEgg();
        }, 1000);
    }

    /**
     * Stops the egg throw timer interval.
     */
    stopEggThrowTimer() {
        if (this.eggThrowInterval) {
            clearInterval(this.eggThrowInterval);
            this.eggThrowInterval = null;
        }
    }

    /**
     * Attempts to throw an egg if conditions are met.
     */
    tryThrowEgg() {
        if (!this.endboss.world) return;
        this.shoutScream();
        const { currentTime, timeSinceLastEgg, randomThrowInterval } = this.loadParametersThrowEgg();
        if (this.canThrowEgg(timeSinceLastEgg, randomThrowInterval)) {
            this.throwEgg();
            this.lastEggThrowTime = currentTime;
        }
    }

    /**
     * Creates and throws an egg from the endboss position at endboss feet.
     */
    throwEgg() {
        if (this.endboss.world) {
            const egg = new Egg(this.endboss.x + 100, this.endboss.y + 200);
            this.endboss.world.addEgg(egg);
        }
    }

    /**
     * Check if character entered boss arena and play growl sound once.
     */
    shoutScream() {
        if (this.endboss.world?.character && 
            this.endboss.world.character.x >= 1290 && 
            !this.endboss.hasGrowled) {
            this.endboss.playGrowlSound();
            this.endboss.hasGrowled = true;
        }
    }

    /**
     * Checks if egg can be thrown based on all conditions.
     * @param {number} timeSinceLastEgg - Time passed since last egg.
     * @param {number} randomThrowInterval - Random interval for this check.
     * @returns {boolean} True if egg can be thrown.
     */
    canThrowEgg(timeSinceLastEgg, randomThrowInterval) {
        return this.endboss.world.character.x >= 1300 &&
            !this.endboss.attackInProgress &&
            !this.endboss.isDead() &&
            timeSinceLastEgg > randomThrowInterval &&
            this.endboss.attackPhase === 'idle';
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
