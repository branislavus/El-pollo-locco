class StatusBarBottles extends DrawableObject {

    IMAGES_BOTTLES_BLUE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    x = 25;
    y = 40;
    width = 120;
    height = 40;
    bottlesCollected = 0;

    /**
     * Creates a new StatusBarBottles instance and initializes position.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_BOTTLES_BLUE);
        this.setBottlesAmount(0);
    }

    /**
     * Sets the bottle amount and updates the displayed image.
     * @param {number} bottlesCollected - Number of bottles collected (0-5).
     */
    setBottlesAmount(bottlesCollected) {
        bottlesCollected > 5 ? this.botCol = 5 : this.botCol = bottlesCollected;
        let path = this.IMAGES_BOTTLES_BLUE[this.botCol];
        this.img = this.imagePool[path];
    }
}