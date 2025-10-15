class Chicken extends MovableObject {
    height = 50;
    width = 50;
    y = 370;
    offset = {
        top: 0,
        left: 0,
        right: 20,
        bottom: 0,
    };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    currentImage = 0;

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 250 + Math.random() * 500;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.speed = 0.1 + Math.random() * 0.3;
        this.animate();
    }

    animate() {
        // Timer-IDs speichern um sie später stoppen zu können
        this.moveInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    showDeadChicken() {
        // Stoppe alle Bewegungen und Animationen
        this.speed = 0;
        this.isDead = () => true;
        this.stopAnimations();
        // Lade das Todes-Bild
        this.loadImage(this.IMAGE_DEAD);

        // Stoppe die laufenden Animationen

    }

    stopAnimations() {
        // Stoppe die Timer richtig mit clearInterval
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }
}