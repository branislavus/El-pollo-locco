class ChickenSmall extends MovableObject {

    static instanceCounter = 0;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',

    ];
    IMAGE_DEAD_SMALL_CHICKEN = 'img/3_enemies_chicken/chicken_small/2_dead/dead.png';

    height = 40;
    width = 40;
    y = 380;
    currentImage = 0;
    chickenSound = ['onChickeSmall1', 'onChickeSmall2', 'onChickeSmall3'];
    soundTimeout = null;
    offset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 0,
    };

    /**
     * Creates a new ChickenSmall instance and initializes movement and animation.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.id = ++ChickenSmall.instanceCounter;
        this.x = 300 + Math.random() * 1000;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD_SMALL_CHICKEN);
        this.speed = 0.1 + Math.random() * 0.3;
        this.animate();

    }

    /**
     * Starts the movement, animation, and sound intervals for the small chicken.
     */
    animate() {
        this.moveInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
        this.soundInterval = setInterval(() => {
            this.chickenSoundInCue();
        }, 5000);
    }

    /**
     * Displays the dead chicken image and stops all animations.
     */
    showDeadChicken() {
        this.speed = 0;
        this.stopAnimations();
        this.isDead = () => true;
        this.loadImage(this.IMAGE_DEAD_SMALL_CHICKEN);
    }

    /**
     * Stops all animation, movement, and sound intervals.
     */
    stopAnimations() {
        if (this.moveInterval)
            this.stopMoveInterval();
        if (this.animationInterval)
            this.stopAnimateInterval();
        if (this.soundInterval)
            this.stopSoundInterval();
    }

    /**
     * Stops the movement interval.
     */
    stopMoveInterval() {
        clearInterval(this.moveInterval);
        this.moveInterval = null;
    }

    /**
     * Stops the animation interval.
     */
    stopAnimateInterval() {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
    }

    /**
     * Stops the sound interval and pending sound timeout.
     */
    stopSoundInterval() {
        clearInterval(this.soundInterval);
        this.soundInterval = null;
        if (this.soundTimeout) {
            clearTimeout(this.soundTimeout);
            this.soundTimeout = null;
        }
    }

    /**
     * Generates a random number for sound selection.
     * @returns {number} Random number between 0 and 2.
     */
    chickenRandomSound() {
        return Math.floor(Math.random() * 3);
    }

    /**
     * Queues a random chicken sound with a delay.
     */
    chickenSoundInCue() {
        if (this.isDead && this.isDead()) return;
        this.soundTimeout = setTimeout(() => {
            let randomSound = this.chickenRandomSound();
            this.chooseSound(randomSound);
        }, Math.floor(Math.random() * 5000));
    }

    /**
     * Plays a small chicken sound based on the random number.
     * @param {number} randomSound - The random sound index (0-2).
     */
    chooseSound(randomSound) {
        if (world?.gameOver || this.isDead()) return;
        if (typeof audioManager === 'undefined') return;

        const sounds = [audioManager.onChickenSmall1, audioManager.onChickenSmall2, audioManager.onChickenSmall3];
        sounds[randomSound]?.call(audioManager);
    }
}