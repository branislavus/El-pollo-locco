class ChickenSmall extends MovableObject {

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
    offset = {
        top: 0,
        left: -10,
        right: -10,
        bottom: 0,
    };

    /**
     * Creates a new ChickenSmall instance and initializes movement and animation.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 120 + Math.random() * 1000;
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
        this.isDead = () => true;
        this.stopAnimations();
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
     * Stops the sound interval.
     */
    stopSoundInterval() {
        clearInterval(this.soundInterval);
        this.soundInterval = null;
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
        setTimeout(() => {
            let randomSound = this.chickenRandomSound();
            this.chooseSound(randomSound);
        }, Math.floor(Math.random() * 5000));
    }


    /**
     * Plays a small chicken sound based on the random number.
     * @param {number} randomSound - The random sound index (0-2).
     */
    chooseSound(randomSound) {
        if (randomSound === 0 && typeof audioManager !== 'undefined') {
            audioManager.onChickenSmall1();
        } else if (randomSound === 1 && typeof audioManager !== 'undefined') {
            audioManager.onChickenSmall2();
        } else if (randomSound === 2 && typeof audioManager !== 'undefined') {
            audioManager.onChickenSmall3();
        }
    }
}