class Bottles extends DrawableObject {

    IMAGE_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]

    constructor(x, y) {
        super().loadImage(this.IMAGE_BOTTLE[this.randomBottle()]);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 44;
    }

    randomBottle() {
        return Math.random() < 0.5 ? 0 : 1;
    }
}