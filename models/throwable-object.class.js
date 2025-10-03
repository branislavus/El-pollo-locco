class ThrowableObject extends MovableObject {



    constructor(x, y, direction) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
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

        setInterval(() => {
            if (this.isAboveGround()) {
                this.x += this.throwLeft ? -6 : 6;
            }
        }, 1000 / 60);
    }
}