class Endboss extends MovableObject {
    currentImage = 0;
    height = 300;
    width = 300;
    y = 140;
    bossEnergy = 5;
    hurtImageIndex = 0;
    movementEnabled = true;

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
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
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
        this.energy = 100; // Setze energy hoch, damit MovableObject-Methoden nicht interferieren
        this.animate();
    }

    animate() {
        // Standard Loop-Animationen (Alert, Walk, Attack)
        setInterval(() => {
            if (!this.isDead() && !this.isHurt()) {
                if (this.isAttacking()) {
                    this.atack();
                } else if (this.isMoving()) {
                    this.walk();
                } else {
                    this.alert();
                }
            }
        }, 200);

        // Hurt-Animation (eigenes Interval)
        setInterval(() => {
            if (this.isHurt()) {
                this.hurt();
            }
        }, 200);

        // Death-Animation (eigenes Interval)
        setInterval(() => {
            if (this.isDead()) {
                this.dead();
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

    isHurt() {
        // Überschreibt die Methode aus MovableObject
        return this.hurtImageIndex == 1;
    }

    isDead() {
        // Überschreibt die Methode aus MovableObject - verwendet bossEnergy statt energy
        return this.bossEnergy <= 0;
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
        this.playAnimationOnce(this.IMAGES_DEAD);
    }

    hurt() {
        this.playAnimationOnce(this.IMAGES_HURT);
        
        // Reset nach kompletter Animation
        if (this.currentImage >= this.IMAGES_HURT.length - 1) {
            setTimeout(() => {
                this.hurtImageIndex = 0;
                this.currentImage = 0;
                this.movementEnabled = true;
            }, 200);
        }
    }
}
