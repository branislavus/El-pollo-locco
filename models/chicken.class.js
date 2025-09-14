class Chicken extends MovableObject {
    height = 50;
    width = 50;
    y = 370;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    currentImage = 0;

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 120 + Math.random() * 500;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
        this.speed = 0.1 + Math.random() * 0.3;
        this.moveLeft();
    }

    animate() {
        setInterval(() => {
            let i = this.currentImage % this.IMAGES_WALKING.length;
            let path = this.IMAGES_WALKING[i];
            this.img.src = this.imagePool[path];
            this.currentImage++;
        }, 200);
    }

}