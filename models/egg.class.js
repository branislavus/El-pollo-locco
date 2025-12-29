class Egg extends MovableObject {
    IMAGE_EGG = 'img/egg.svg';
    
    constructor(x, y) {
        super().loadImage(this.IMAGE_EGG);
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 60;
        this.speed = 8; // Roll speed to the left
        this.shouldBeRemoved = false;
        this.isCracked = false;
        this.startX = x; // Store start position to track distance
        this.audio = new AudioManager();
        
        // Set offset for collision detection
        this.offset = {
            top: 15,
            bottom: 15,
            left: 10,
            right: 10
        };
        this.throwEgg();
    }

    /**
     * Throws egg - starts rolling animation and movement.
     */
    throwEgg() {
        this.rollInterval = setInterval(() => {
            this.x -= this.speed; // Move left
            this.rotate(); // Rotate egg while rolling
            
            const distanceTraveled = this.startX - this.x;
            
            // Crack egg after 1000px distance or if off screen
            if (distanceTraveled >= 600 || this.x < -200) {
                this.crackEgg();
            }
        }, 1000 / 60); // 60 FPS
    }

    /**
     * Rotates the egg image for rolling effect.
     */
    rotate() {
        this.rotationAngle = (this.rotationAngle || 0) - 10;
    }

    /**
     * Prevent multiple cracks 
     * Cracks the egg - plays sound and marks for removal.
     * and then Remove egg
     */
    crackEgg() {
        if (this.isCracked) return;
        this.isCracked = true;
        this.playEggCrackingSound();
        this.stopRolling();
        this.shouldBeRemoved = true;
    }

    /**
     * Custom draw method with rotation for rolling effect and don't draw cracked egg.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.isCracked) return;     
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate((this.rotationAngle || 0) * Math.PI / 180);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    /**
     * Stops the rolling animation.
     */
    stopRolling() {
        if (this.rollInterval) {
            clearInterval(this.rollInterval);
            this.rollInterval = null;
        }
    }

        /**
     * Plays onEggCracking sound.
     */
    playEggCrackingSound() {
        if (typeof audioManager !== 'undefined')
            audioManager.onEggCracking();
    }
}