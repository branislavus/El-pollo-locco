class Endboss extends MovableObject {

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

    currentImage = 0;
    height = 300;
    width = 300;
    speed = 15;
    y = 140;
    bossEnergy = 5;
    hurtImageIndex = 0;
    movementEnabled = true;
    world;
    attackInProgress = false;
    attackPhase = 'idle';  // idle, moving_left, attacking, moving_right
    attackDuration = 300; // Dauer der Attack-Animation
    moveSpeed = 10;         // Bewegungsgeschwindigkeit
    shouldAttackAfterHurt = false; // Trigger für Angriff nach Schaden
    lastWalkSoundTime = 0; // Für Walk-Sound Throttling
    audio = new AudioManager(); // AudioManager für playSoundIfDoingSomething
    deathSoundPlayed = false; // Flag um Death-Sound nur einmal abzuspielen


    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2000;
        this.energy = 100; // Setze energy hoch, damit MovableObject-Methoden nicht interferieren
        this.isDeathAnimationComplete = false;
        this.shouldBeRemoved = false;
        this.hurtAnimationStarted = false;
        this.deathAnimationStarted = false;
        this.animate();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (this.isDeathAnimationComplete || !this.movementEnabled) return;

            // Priorität 1: Tod (höchste Priorität)
            if (this.isDead() && !this.isDeathAnimationComplete && !this.deathSoundPlayed) {
                // Sound sofort abspielen (nur einmal)
                if (typeof audioManager !== 'undefined') audioManager.bossOnDie();
                this.deathSoundPlayed = true; // Flag setzen
                
                // Animation nach 2 Sekunden starten
                setTimeout(() => {
                     this.dead();
                }, 1000);
            }
            // Priorität 2: Hurt Animation (muss vor Attack kommen!)
            else if (this.isHurt() && !this.isDead() && !this.isDeathAnimationComplete) {
                this.hurt();
            }
            // Priorität 3: Angriff (nur wenn nicht hurt oder tot)
            else if (this.isAttacking() && !this.attackInProgress && !this.isDead() && !this.isHurt() && !this.isDeathAnimationComplete) {
                this.atackAnimation();
                if (typeof audioManager !== 'undefined') audioManager.bossOnBite();
            }
            // Priorität 4: Normal Alert (niedrigste Priorität)
            else if (!this.isDead() && !this.isHurt() && !this.attackInProgress && !this.isDeathAnimationComplete) {
                this.alert();
            }
        }, 200);
    }

    getRandomAtackInterval() {
        return Math.floor(Math.random() * 20) + 8;
    }


    atackAnimation() {
        if (this.attackInProgress) return;
        this.world.character.energy -= 10;
        this.attackInProgress = true;
        this.attackPhase = 'moving_left';

        const attackConfig = this.getRandomAttackSettings();
        const startX = this.x;

        this.executeAttackSequence(attackConfig, startX);
    }

    getRandomAttackSettings() {
        return {
            moveDuration: Math.floor(Math.random() * 1500) + 1000,    // 500-2000ms
            attackDuration: Math.floor(Math.random() * 400) + 200,   // 200-600ms
            moveSpeed: Math.floor(Math.random() * 8) + 10             // 5-12 speed
        };
    }

    executeAttackSequence(config, startX) {
        // Phase 1: Move Left
        const moveLeftInterval = this.startMoveLeftPhase(config.moveSpeed);

        setTimeout(() => {
            clearInterval(moveLeftInterval);
            this.startAttackPhase(config, startX);
        }, config.moveDuration);
    }

    startMoveLeftPhase(moveSpeed) {
        this.attackPhase = 'moving_left';
        return setInterval(() => {
            if (!this.movementEnabled) return; // Stoppe wenn Movement disabled
            this.x -= moveSpeed;
            this.playAnimation(this.IMAGES_WALKING);
            this.playSoundIfDoingSomething('bossOnWalk', 800);
        }, 1000 / 10); // Langsamere Animation: 10 FPS statt 25 FPS
    }

    startAttackPhase(config, startX) {
        this.attackPhase = 'attacking';

        const attackInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ATTACK);
        }, 200);

        setTimeout(() => {
            clearInterval(attackInterval);
            this.startMoveRightPhase(config.moveSpeed, startX);
        }, config.attackDuration);
    }

    startMoveRightPhase(moveSpeed, startX) {
        this.attackPhase = 'moving_right';

        const moveRightInterval = setInterval(() => {
            if (!this.movementEnabled) {
                clearInterval(moveRightInterval);
                return;
            }
            if (this.x < startX) {
                this.x += moveSpeed;
                this.playAnimation(this.IMAGES_WALKING);
                this.playSoundIfDoingSomething('bossOnWalk', 800);
            } else {
                clearInterval(moveRightInterval);
                this.resetAttackState();
            }
        }, 1000 / 10); // Langsamere Animation: 10 FPS statt 25 FPS
    }

    resetAttackState() {
        this.attackInProgress = false;
        this.attackPhase = 'idle';
    }

    isAttacking() {
        if (this.world && this.world.character) {
            let characterX = this.world.character.x;
            let distanceToCharacter = Math.abs(this.x - characterX);

            // Sofort angreifen wenn Schaden erhalten
            if (this.shouldAttackAfterHurt && distanceToCharacter < 500) {
                this.shouldAttackAfterHurt = false; // Reset Flag
                return true;
            }

            // Normale Distanz-basierte Angriffe
            return distanceToCharacter < 300;
        }
        return false; // Kein Character gefunden
    }

    atack() {
        this.playAnimation(this.IMAGES_ATTACK);
    }

    walk() {
        this.playAnimation(this.IMAGES_WALKING);
        this.playSoundIfDoingSomething('bossOnWalk', 800);
    }


    isHurt() {
        // Überschreibt die Methode aus MovableObject
        return this.hurtImageIndex == 1;
    }

    isDead() {
        // Überschreibt die Methode aus MovableObject - verwendet bossEnergy statt energy
        return this.bossEnergy <= 0;
    }

    alert() {
        this.playAnimation(this.IMAGES_ALERT);
    }

    dead() {
        if (!this.deathAnimationStarted) {
            this.stopAllMovements();
            // Spiele Death-Animation komplett ab
            let deathInterval = setInterval(() => {
                if (this.currentImage < this.IMAGES_DEAD.length) {
                    let path = this.IMAGES_DEAD[this.currentImage];
                    this.img = this.imagePool[path];
                    this.currentImage++;
                } else {
                    // Animation komplett - bleibt am letzten Bild
                    clearInterval(deathInterval);
                    this.isDeathAnimationComplete = true;

                    // Zeige letztes Bild der Death-Animation
                    let lastFrame = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
                    this.img = this.imagePool[lastFrame];

                    // Nach 2 Sekunden verschwinden
                    setTimeout(() => {
                        this.shouldBeRemoved = true;
                    }, 2000);
                }
            }, 200); // 200ms pro Frame für deutlich sichtbare Death-Animation
        }
    }

    stopAllMovements() {
        this.attackInProgress = false;
        this.movementEnabled = false;
        this.deathAnimationStarted = true;
        this.currentImage = 0;
    }

    hurt() {
        if (!this.hurtAnimationStarted) {
            this.hurtAnimationStarted = true;
            this.currentImage = 0; // Reset für saubere Animation
            if (typeof audioManager !== 'undefined') audioManager.onBossHurt();

            // Triggere Angriff nach Schaden
            this.takeDamage();

            // Spiele Hurt-Animation komplett ab
            let hurtInterval = setInterval(() => {
                if (this.currentImage < this.IMAGES_HURT.length) {
                    let path = this.IMAGES_HURT[this.currentImage];
                    this.img = this.imagePool[path];
                    this.currentImage++;
                } else {
                    this.resetHurtAnimation(hurtInterval);
                }
            }, 150); // 150ms pro Frame für sichtbare Animation
        }
    }

    takeDamage() {
        // Verzögere den Angriff bis nach der Hurt-Animation
        if (!this.attackInProgress) {
            setTimeout(() => {
                this.shouldAttackAfterHurt = true;
            }, 500); // 500ms = ca. 3 Frames à 150ms der Hurt-Animation
        }
    }

    resetHurtAnimation(hurtInterval) {
        clearInterval(hurtInterval);
        this.hurtAnimationStarted = false;
        this.hurtImageIndex = 0;
        this.currentImage = 0;
        this.movementEnabled = true;
    }

    stopAnimations() {
        // Stoppe alle Bewegungen und Sounds
        this.movementEnabled = false;
        this.attackInProgress = false;
        this.shouldAttackAfterHurt = false;
        this.speed = 0;
        
        // Stoppe Animation-Interval
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }


}
