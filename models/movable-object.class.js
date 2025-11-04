class MovableObject extends DrawableObject {

    speed = 0.15;
    characterDirectionLeft = false;
    speedY = 0;
    acceleration = 2;
    lastHit = 0;
    collectedBottles = 0;
    collectedCoins = 0;
    isEnemyDead = false;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 30);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y < 355;
        } else {
            return this.y < 221;
        }
    }

    moveRight() {
        this.x += this.speed;
        this.characterDirectionLeft = false;
    }

    moveLeft() {
        this.x -= this.speed;
        if (this instanceof Character) {
            this.characterDirectionLeft = true;
        }

    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imagePool[path];
        this.currentImage++;
    }


    playAnimationOnce(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imagePool[path];
        if (this.currentImage < images.length - 1) {
            setTimeout(() => {
                this.currentImage++;
            }, 10);
        } else {
            this.movementEnabled = false;
        }
    }

    hit() {
        this.energy -= 2;
        if (this.energy < 0) {
            this.energy = 0
        } else {
            this.lastHit = new Date().getTime();
        }

    }

    isDead() {
        return this.energy <= 0;
    }

    isHurt() {
        let timePast = new Date().getTime() - this.lastHit;
        timePast = timePast / 1000;
        return timePast < 1.5;
    }

    collectBottle(bottle) {
        if (!bottle) return;
        if (this.isColliding(bottle)) {
            this.collectedBottles += 1;
        }
    }

    collectCoin(coin) {
        if (!coin) return;
        if (this.isColliding(coin)) {
            this.collectedCoins += 1;
        }
    }

    die() {
        this.isDead = true;
        this.speed = 0;
        this.playDeathAnimation && this.playDeathAnimation();


        setTimeout(() => {
            let index = world.level.enemies.indexOf(this);
            if (index > -1) world.level.enemies.splice(index, 1);
        }, 800);
    }

    playSoundIfDoingSomething(sound, time) {
        const currentTime = new Date().getTime();
        if (currentTime - this.lastWalkSoundTime > time) {
            this.audio[sound]();
            this.lastWalkSoundTime = currentTime;
        }
    }
}