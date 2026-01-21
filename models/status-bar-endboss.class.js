class StatusBarEndBoss extends DrawableObject {

    IMAGES_STATUSBAR_BOSS_ORANGE = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
    ];

    x = 575;
    y = 10;
    width = 120;
    height = 40;
    bossEnergy = 5;

    /**
     * Creates a new StatusBarEndBoss instance and initializes position.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_STATUSBAR_BOSS_ORANGE);
        this.setBossEnergyAmount(5);
    }

    /**
     * Sets the boss energy amount and updates the displayed image.
     * @param {number} bossEnergy - Boss energy level (0-5).
     */
    setBossEnergyAmount(bossEnergy) {
        this.bossEnergy = bossEnergy;
        let path = this.IMAGES_STATUSBAR_BOSS_ORANGE[this.bossEnergy];
        this.img = this.imagePool[path];
    }
}