class Chicken extends MovableObject {

    static instanceCounter = 0;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    world;
    height = 50;
    width = 50;
    y = 370;
    offset = {
        top: 30,
        left: 0,
        right: 0,
        bottom: 0,
    };
    currentImage = 0;
    soundTimeout = null;


    /**
     * Creates a new Chicken instance and initializes movement and animation.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.id = ++Chicken.instanceCounter;
        this.x = 350 + Math.random() * 1500;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.speed = 0.1 + Math.random() * 0.3;
        this.animate();

    }


    /**
     * Starts the movement, animation, and sound intervals for the chicken.
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
        }, 10000);
    }


    /**
     * Displays the dead chicken image and stops all animations.
     */
    showDeadChicken() {
        this.speed = 0;
        this.stopAnimations(); // Stop intervals FIRST before setting isDead
        this.isDead = () => true;
        this.loadImage(this.IMAGE_DEAD);
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
        this.soundTimeout = setTimeout(() => {
            let randomSound = this.chickenRandomSound();
            this.chooseSound(randomSound);
        }, Math.floor(Math.random() * 5000));
    }


    /**
     * Plays a chicken sound based on the random number.
     * @param {number} randomSound - The random sound index (0-2).
     */
    chooseSound(randomSound) {
        if (world?.gameOver || this.isDead()) return;
        if (typeof audioManager === 'undefined') return;

        const sounds = [audioManager.onChicken1, audioManager.onChicken2, audioManager.onChicken1];
        sounds[randomSound]?.call(audioManager);
    }
}