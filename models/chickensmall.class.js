class ChickenSmall extends MovableObject {
    height = 40;
    width = 40;
    y = 380;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',

    ];
    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_small/2_dead/dead.png';

    currentImage = 0;

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 120 + Math.random() * 500;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.speed = 0.1 + Math.random() * 0.3;
        this.animate();

    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    showDeadChicken() {
        // Stoppe alle Bewegungen und Animationen
        this.speed = 0;
        this.isDead = () => true;
        
        // Lade das Todes-Bild
        this.loadImage(this.IMAGE_DEAD);
        
        // Stoppe die laufenden Animationen
        this.stopAnimations();
    }

    stopAnimations() {
        // Überschreibt die animate Methode um Animationen zu stoppen
        this.animate = () => {};
    }

    
}