class ThrowableObject extends MovableObject {

    BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]

    shouldBeRemoved = false;

    constructor(x, y, direction) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 44;
        this.throwLeft = direction;
        this.throw();
    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.rotationAngle = 0;

        this.throwInterval = setInterval(() => {
            if (this.isAboveGround()) {
                this.x += this.throwLeft ? -6 : 6;
                this.rotationAngle += 0.1;
            } else {
                clearInterval(this.throwInterval);
                this.startSplashAnimation();
            }
        }, 1000 / 60);
    }

    startSplashAnimation() {
        let splashIndex = 0;
        let splashInterval = setInterval(() => {
            if (splashIndex < this.BOTTLE_SPLASH.length) {
                this.img = this.imagePool[this.BOTTLE_SPLASH[splashIndex]];
                splashIndex++;
            } else {
                clearInterval(splashInterval);
            }
        }, 100);

        setTimeout(() => {
            this.shouldBeRemoved = true;
        }, 2000);
    }

    draw(ctx) {
        if (this.isAboveGround() && this.rotationAngle !== undefined) {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.rotationAngle);
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}