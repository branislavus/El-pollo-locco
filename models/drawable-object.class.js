class DrawableObject {

    img;
    imagePool = {};
    x = 100;
    y = 225;
    height = 100;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imagePool[path] = img;
        });
    }

    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (error) {
            console.warn('Error loading image :', error);
            console.log('this image :', this.img);
        }
    }

    isColliding(mo) {
        return this.x + (this.width - 40) > mo.x &&
            (this.y + 40) + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;
    }


    drawOffsetFrames(ctx) {
        if (this instanceof Character) {
            if (this.offset) {
                ctx.beginPath();
                ctx.lineWidth = '3'; // Etwas dicker für bessere Sichtbarkeit
                ctx.strokeStyle = 'red';
                // Zeichne die echte Kollisionsbox mit Offsets
                let offsetX = this.x + this.offset.left;
                let offsetY = this.y + this.offset.top;
                let offsetWidth = this.width - this.offset.left - this.offset.right;
                let offsetHeight = this.height - this.offset.top - this.offset.bottom;
                ctx.rect(offsetX, offsetY, offsetWidth, offsetHeight);
                ctx.stroke();
            }
        }
    }

    drawOffsetLineFrames(ctx) {
        if (this instanceof Character) {
            if (this.offsetLine) {
                ctx.beginPath();
                ctx.lineWidth = '3';
                ctx.strokeStyle = 'green';
                let offsetX = this.x + this.offsetLine.left;
                let offsetY = this.y + this.offsetLine.top;
                let offsetWidth = this.width - this.offsetLine.left - this.offsetLine.right;
                let offsetHeight = this.height - this.offsetLine.top - this.offsetLine.bottom;
                ctx.rect(offsetX, offsetY, offsetWidth, offsetHeight);
                ctx.stroke();
            }
        }
    }

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