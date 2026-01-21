class StatusBarCoins extends DrawableObject {

    IMAGES_STATUSBAR_COINS_BLUE = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',

    ];

    x = 25;
    y = 70;
    width = 120;
    height = 40;
    coinsCollected = 0;

    /**
     * Creates a new StatusBarCoins instance and initializes position.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_STATUSBAR_COINS_BLUE);
        this.setCoinsAmount(0);
    }

    /**
     * Sets the coin amount and updates the displayed image.
     * @param {number} coinsCollected - Number of coins collected (divided by 4 for display).
     */
    setCoinsAmount(coinsCollected) {
        this.coinsCollected = Math.floor(coinsCollected / 4);
        let path = this.IMAGES_STATUSBAR_COINS_BLUE[this.coinsCollected];
        this.img = this.imagePool[path];
    }
}