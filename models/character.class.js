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
    speed = 5;
    currentImage = 0;
    world;
    energy = 100;
    lastMove;
    lastMoveTime;
    lastCharacterX;
    offset = {
        top: 70,
        left: 30,
        right: 30,
        bottom: 10,
    };

    /**
     * Creates a new Character instance and loads all images and sounds.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.y = 226; 
        this.lastWalkSoundTime = 0; 
        this.animate();
        this.applyGravity();
    }

    /**
     * Checks if the character is above the ground.
     * @returns {boolean} True if above ground, else false.
     */
    isAboveGround() {
        return this.y < 226;
    }

    /**
     * Starts the animation and movement intervals for the character.
     */
    animate() {
        this.movementEnabled = true;
        this.movementInterval = setInterval(() => {
            if (this.movementEnabled)
                this.getMovingInterval();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            this.getLastMove();
            this.getCharacterAnimation();

        }, 1000 / 10);
    }

    /**
     * Handles character animation based on state (dead, hurt, idle, jumping, reset when landing, walking).
     */
    getCharacterAnimation() {
        if (this.isDead()) {
            this.deadInterval();
        } else if (this.isHurt() && !this.isDead()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isIdle() && !this.isDead()) {
            this.isBored();
        } else if (this.isAboveGround() && !this.isDead()) {
            this.playJumpAnimationOnce(this.IMAGES_JUMPING);
        } else {
            this.resetJumpAnimation();
            if (this.canMove() && !this.isDead())
                this.playAnimation(this.IMAGES_WALKING);
        }
    }


    /**
     * Executes the dead animation and stops all movement.
     */
    deadInterval() {
        audioManager.onDie();
        this.stopAllMovement();
        this.playDeadAnimationOnce();
        return;
    }

    /**
     * Handles movement logic for walking and jumping.
     */
    getMovingInterval() {
        let isWalking = false;
        if (this.canMoveRight() && !this.isDead()) {
            this.moveRight();
            if (!this.isAboveGround()) isWalking = true;
            if (this.canJump() && !this.isDead()) this.jumpAndShout();
        }
        if (this.canMoveLeft() && !this.isDead()) {
            this.moveLeft();
            if (!this.isAboveGround()) isWalking = true;
            if (this.canJump() && !this.isDead()) this.jumpAndShout();
        }
        if (this.canJump() && !this.isDead()) this.jumpAndShout();
        if (isWalking) this.playWalkingSound();
    }

    /**
     * Plays the jump sound effect.
     */
    playJumpSound() {
        if (!audioManager.isMuted) this.audio.onJump();
    }

    /**
     * Plays the walking sound effect if moving.
     */
    playWalkingSound() {
        if (!audioManager.isMuted) {
            this.playSoundIfDoingSomething('onWalk', 300);
        }
    }

    /**
     * Plays idle or long idle animation and sleep sound if bored.
     */
    isBored() {
        if (this.isDead()) return;
        if (this.lastMoveTime > 16000) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            if (this.movementEnabled) {
                if (!audioManager.isMuted) this.playSoundIfDoingSomething('onSleep', 5000);
            }
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    /**
     * Updates last movement time for idle detection.
     */
    getLastMove() {
        let currentTime = new Date().getTime();
        if (this.lastCharacterX != this.x) {
            this.lastMove = currentTime;
            this.lastCharacterX = this.x;
        }
        this.lastMoveTime = currentTime - (this.lastMove || currentTime);
    }

    /**
     * Checks if the character is idle.
     * @returns {boolean} True if idle, else false.
     */
    isIdle() {
        return this.lastMoveTime > 3000;
    }

    /**
     * Starts the dead animation sequence once.
     */
    playDeadAnimationOnce() {
        if (this.deadAnimationInterval) {
            clearInterval(this.deadAnimationInterval);
        }
        this.deadAnimationFrame = 0;
        this.playDeadAnimation();
    }

    /**
     * Plays the dead animation frame by frame.
     */
    playDeadAnimation() {
        this.deadAnimationInterval = setInterval(() => {
            if (this.deadAnimationFrame < this.IMAGES_DEAD.length) {
                this.img = this.imagePool[this.IMAGES_DEAD[this.deadAnimationFrame]];
                this.deadAnimationFrame++;
            } else {
                clearInterval(this.deadAnimationInterval);
            }
        }, 300);
    }

    /**
     * Makes the character jump and plays the jump sound.
     */
    jumpAndShout() {
        this.jump();
        this.playJumpSound();
    }

    /**
     * Sets jump speed and updates last movement time.
     */
    jump() {
        this.speedY = 30;
        this.lastMove = new Date().getTime();
    }

    /**
     * Checks if the character can move right.
     * @returns {boolean} True if can move right, else false.
     */
    canMoveRight() {
        return this.movementEnabled && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && !this.isDead();
    }

    /**
     * Checks if the character can move left.
     * @returns {boolean} True if can move left, else false.
     */
    canMoveLeft() {
        return this.movementEnabled && this.world.keyboard.LEFT && this.x > this.world.level.level_start_x && !this.isDead();
    }

    /**
     * Checks if the character can move.
     * @returns {boolean} True if can move, else false.
     */
    canMove() {
        return this.movementEnabled && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isDead();
    }

    /**
     * Checks if the character can jump.
     * @returns {boolean} True if can jump, else false.
     */
    canJump() {
        return this.movementEnabled && (this.world.keyboard.UP && !this.isAboveGround() || this.world.keyboard.SPACE && !this.isAboveGround()) && !this.isDead();
    }

    /**
     * Disables character movement.
     */
    disableMovement() {
        this.movementEnabled = false;
    }

    /**
     * Enables character movement.
     */
    enableMovement() {
        this.movementEnabled = true;
    }

    /**
     * Stops all movement and animation intervals for the character.
     */
    stopAllMovement() {
        this.speedY = 0;
        this.speed = 0;
        this.disableMovement();
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