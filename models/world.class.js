class World {
    character = new Character();
    clouds = [
        new Cloud(),
        new Cloud(),
        new Cloud()
    ];
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken()
    ];
    backgroundObjects = [
         new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/air.png', 1),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 1),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 1),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 1),
        new BackgroundObject('img/5_background/layers/air.png', 720),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/air.png', 720*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720*2),
        new BackgroundObject('img/5_background/layers/air.png', 720*3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720*3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720*3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720*3)
    ]
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        })
    }

    addObjectsToMap(object) {
        object.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.characterDirectionLeft) {
            this.flipImage(mo);
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if (mo.characterDirectionLeft) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    setWorld() {
        this.character.world = this;
    }

    loadAllBackgrounds() {

    }
}