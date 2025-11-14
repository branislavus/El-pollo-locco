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
     * Cracks the egg - plays sound and marks for removal.
     */
    crackEgg() {
        if (this.isCracked) return; // Prevent multiple cracks
        
        this.isCracked = true;
        this.audio.onEggCracking();
        this.stopRolling();
        
        // Remove egg after short delay to show crack moment
        setTimeout(() => {
            this.shouldBeRemoved = true;
        }, 100);
    }

    /**
     * Custom draw method with rotation for rolling effect.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.isCracked) return; // Don't draw cracked egg
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate((this.rotationAngle || 0) * Math.PI / 180);
        try {
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        } catch (error) {
            console.warn('Error loading egg image:', error);
        }
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
}