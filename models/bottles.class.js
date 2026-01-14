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

    /**
     * Returns a random bottle image index.
     * @returns {number} Random index 0 or 1 for bottle image selection.
     */
    randomBottle() {
        return Math.floor(Math.random() * 2);
    }
}