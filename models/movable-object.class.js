class MovableObject extends DrawableObject {

    speed = 0.15;
    characterDirectionLeft = false;
    speedY = 0;
    acceleration = 2;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 30);
    }

    isAboveGround() {
        return this.y < 221;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img.src = this.imagePool[path];
        this.currentImage++;
    }



    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height
    }

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0
        }else{
            this.lastHit = new Date().getTime();
        }
     
    }

    isDead() {
        return this.energy == 0;
    }

    isHurt() {
        let timePast = new Date().getTime() - this.lastHit;
        timePast = timePast / 1000;
        // console.log(Math.round(timePast));
        
        return timePast < 1.5; 
    }
}