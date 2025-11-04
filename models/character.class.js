class Character extends MovableObject {
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    audio = new AudioManager();
    height = 200;
    width = 100;
    speed = 3;
    currentImage = 0;
    world;
    energy = 100;
    lastMove;
    lastMoveTime;
    lastCharacterX;
    offset = {
        top: 70,
        left: 30,
        right: 40,
        bottom: 10,
    };
    offsetLine = {
        top: 70,
        left: 49,
        right: 50,
        bottom: 10,
    };


    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.y = 226; // Standard Laufposition setzen
        this.lastWalkSoundTime = 0; // Für Walk-Sound Throttling
        this.animate();
        this.applyGravity();
    }

    isAboveGround() {
        // Überschreibt MovableObject - Character soll immer bei y=221 landen
        return this.y < 226;
    }

    animate() {
        this.movementEnabled = true;

        // Speichere Interval-IDs um sie stoppen zu können
        this.movementInterval = setInterval(() => {
            if (this.movementEnabled) {
                let isWalking = false;

                if (this.canMoveRight() && !this.isDead()) {
                    this.moveRight();
                    if (!this.isAboveGround()) isWalking = true;
                }
                if (this.canMoveLeft() && !this.isDead()) {
                    this.moveLeft();
                    if (!this.isAboveGround()) isWalking = true;
                }
                if (this.canJump() && !this.isDead()) {
                    this.jump();
                    this.playJumpSound();
                }

                // Walk-Sound mit einfachem Throttling
                if (isWalking) this.playWalkingSound();
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            this.updateLastMove();

            if (this.isDead()) {
                audioManager.onDie();
                setTimeout(() => {
                    this.stopAllMovement();
                    this.playDeadAnimationOnce();
                }, 4000);
                return;
            } else if (this.isHurt() && !this.isDead()) {
                // Sound wird bereits in damageCharacter() abgespielt
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isIdle() && !this.isDead()) {
                this.isBored();
            } else if (this.isAboveGround() && !this.isDead()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.canMove() && !this.isDead())
                    this.playAnimation(this.IMAGES_WALKING);
            }

        }, 1000 / 20);
    }

    playJumpSound() {
        if (!audioManager.isMuted) this.audio.onJump();
    }
    playWalkingSound() {
        if (!audioManager.isMuted) {
            this.playSoundIfDoingSomething('onWalk', 300);
        }
    }

    isBored() {
        if (this.lastMoveTime > 16000 && !this.isDead()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            // Nur Sound abspielen wenn Movement enabled ist (Spiel läuft)
            if (this.movementEnabled) {
                if (!audioManager.isMuted) {
                    this.playSoundIfDoingSomething('onSleep', 5000);
                }
            }
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }



    updateLastMove() {
        let currentTime = new Date().getTime();
        if (this.lastCharacterX != this.x) {
            this.lastMove = currentTime;
            this.lastCharacterX = this.x;
        }
        this.lastMoveTime = currentTime - (this.lastMove || currentTime);
    }

    isIdle() {
        return this.lastMoveTime > 3000;
    }

    playDeadAnimationOnce() {
        this.playAnimationOnce(this.IMAGES_DEAD);
    }

    jump() {
        this.speedY = 30;
        this.lastMove = new Date().getTime();
    }

    canMoveRight() {
        return this.movementEnabled && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && !this.isDead();
    }

    canMoveLeft() {
        return this.movementEnabled && this.world.keyboard.LEFT && this.x > this.world.level.level_start_x && !this.isDead();
    }

    canMove() {
        return this.movementEnabled && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isDead();
    }

    canJump() {
        return this.movementEnabled && (this.world.keyboard.UP && !this.isAboveGround() || this.world.keyboard.SPACE && !this.isAboveGround()) && !this.isDead();
    }


    disableMovement() {
        this.movementEnabled = false;
    }

    enableMovement() {
        this.movementEnabled = true;
    }

    stopAllMovement() {
        this.speedY = 0;
        this.speed = 0;
        this.disableMovement();

        // Stoppe alle Character-Intervals
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }
}