class StatusBarEndBoss extends DrawableObject {

    bossEnergy = 5;

    IMAGES_STATUSBAR_BOSS_ORANGE = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
    ];

    /**
     * Creates a new StatusBarEndBoss instance and initializes position.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_STATUSBAR_BOSS_ORANGE);
        this.x = 575;
        this.y = 10;
        this.width = 120;
        this.height = 40;
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