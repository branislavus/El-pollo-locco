class DrawableObject {

    img;
    imagePool = {};
    x = 100;
    y = 225;
    height = 100;
    width = 100;

    /**
     * Loads a single image from the specified path.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images from an array of paths into the image pool.
     * @param {string[]} arr - Array of image paths.
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imagePool[path] = img;
        });
    }

    /**
     * Draws the object on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
            if (this.img && this.img.complete && this.img.naturalHeight > 0) 
                ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Checks if this object is colliding with another movable object.
     * @param {MovableObject} mo - The movable object to check collision with.
     * @returns {boolean} True if colliding, else false.
     */
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y  + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;
    }

    /**
     * Checks collision with offset boundaries for more precise detection.
     * @param {MovableObject} mo - The movable object to check collision with.
     * @returns {boolean} True if colliding with offset, else false.
     */
    isCollidingOffset(mo) {
        return (
            this.x + this.offset.left < mo.x + mo.width - (mo.offset?.right || 0) &&
            this.x + this.width - this.offset.right > mo.x + (mo.offset?.left || 0) &&
            this.y + this.offset.top < mo.y + mo.height - (mo.offset?.bottom || 0) &&
            this.y + this.height - this.offset.bottom > mo.y + (mo.offset?.top || 0)
        );
    }

    /**
     * Draws red offset frames for debugging collision boundaries (Character only).
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * set drawBorderFramesYes = true to work
     */
    drawOffsetFrames(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof Endboss) {
            if (this.offset) {
                ctx.beginPath();
                ctx.lineWidth = '3';
                ctx.strokeStyle = 'red';
                let offsetX = this.x + this.offset.left;
                let offsetY = this.y + this.offset.top;
                let offsetWidth = this.width - this.offset.left - this.offset.right;
                let offsetHeight = this.height - this.offset.top - this.offset.bottom;
                ctx.rect(offsetX, offsetY, offsetWidth, offsetHeight);
                ctx.stroke();
            }
        }
    }

    /**
     * Draws blue border frames for debugging object boundaries.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * set drawBorderFramesYes = true to work
      */
    drawBorderFrames(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }
}