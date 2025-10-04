class StatusBarCoins extends DrawableObject {

     coinsCollected = 0;

    IMAGES_STATUSBAR_COINS_BLUE = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',

    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES_STATUSBAR_COINS_BLUE);
        this.x = 25;
        this.y = 70;
        this.width = 120;
        this.height = 40;
        this.setCoinsAmount(0);
    }

    setCoinsAmount(coinsCollected) {
        this.coinsCollected = Math.floor(coinsCollected / 4);
        let path = this.IMAGES_STATUSBAR_COINS_BLUE[this.coinsCollected];
        this.img = this.imagePool[path];
    }

}