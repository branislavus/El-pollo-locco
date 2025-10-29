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

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 120 + Math.random() * 1000;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD_SMALL_CHICKEN);
        this.speed = 0.1 + Math.random() * 0.3;
        this.animate();

    }

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

    showDeadChicken() {
        // Stoppe alle Bewegungen und Animationen
        this.speed = 0;
        this.isDead = () => true;
        this.stopAnimations();
        // Lade das Todes-Bild
        this.loadImage(this.IMAGE_DEAD_SMALL_CHICKEN);
    }

    stopAnimations() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }

        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }

        if (this.soundInterval) {
            clearInterval(this.soundInterval);
            this.soundInterval = null;
        }
    }

    chickenRandomSound() {
        return Math.floor(Math.random() * 3);
    }

    chickenSoundInCue() {
        setTimeout(() => {
            // Direkter Audio-Aufruf basierend auf Random-Wert
            let randomSound = this.chickenRandomSound();
            if (randomSound === 0 && typeof audioManager !== 'undefined') {
                audioManager.onChickenSmall1();
            } else if (randomSound === 1 && typeof audioManager !== 'undefined') {
                audioManager.onChickenSmall2();
            } else if (randomSound === 2 && typeof audioManager !== 'undefined') {
                audioManager.onChickenSmall3(); // Fallback zu onChicken1
            }
        }, Math.floor(Math.random() * 5000)); // 10 Sekunden für besseres Timing
    }
}