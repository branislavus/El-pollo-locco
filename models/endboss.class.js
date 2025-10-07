class Endboss extends MovableObject {
    currentImage = 0;
    height = 300;
    width = 300;
    y = 140;
    bossEnergy = 5;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2000;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.dead();
            } else if (this.isHurt()) {
                this.hurt();
            } else if (this.isAttacking()) {
                this.atack();
            } else if (this.isMoving()) {
                this.walk();
            } else if (this.angry()) {
                this.alert();
            } else {
               this.alert();
            }
        }, 200);
    }

    isAttacking() {
        // Füge hier Logik hinzu wann der Endboss angreift
        return false; // Vorerst deaktiviert
    }

    isMoving() {
        // Füge hier Logik hinzu wann der Endboss sich bewegt
        return false; // Vorerst deaktiviert
    }


    atack() {
        this.playAnimation(this.IMAGES_ATTACK);
    }

    walk() {
        this.playAnimation(this.IMAGES_WALKING);
    }

    alert() {
        this.playAnimation(this.IMAGES_ALERT);
    }

    dead() {
        this.playDeadAnimationOnce(this.IMAGES_DEAD);
    }

    hurt() {
        this.playDeadAnimationOnce(this.IMAGES_HURT);
    }
}
