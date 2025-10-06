class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBarHealth();
    statusBarCoins = new StatusBarCoins();
    statusBarBottles = new StatusBarBottles();
    throwableObject = [];
    lastThrow = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.handleThrowableObject();
            this.removeFinishedThrowableObjects();
        }, 200);
    }

    removeFinishedThrowableObjects() {
        this.throwableObject = this.throwableObject.filter(obj => !obj.shouldBeRemoved);
    }

    handleThrowableObject() {
        if (this.canThrow()) {
            let bottle = new ThrowableObject(this.character.x + 40, this.character.y + 60, this.character.characterDirectionLeft);
            this.throwableObject.push(bottle);
            this.lastThrow = new Date().getTime();
            this.collectedBottlesCorrection();
        }
    }

    canThrow() {
        return this.keyboard.D && !this.isThrown() && this.character.collectedBottles > 0;
    }

    isThrown() {
        let timePast = new Date().getTime() - this.lastThrow;
        timePast = timePast / 1000;
        return timePast < 2;
    }

    collectedBottlesCorrection() {
        this.character.collectedBottles -= 1;
        this.statusBarBottles.setBottlesAmount(this.character.collectedBottles);
    }

    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBottlesCollisions();
        this.checkCoinsCollisions();
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy, index) => {
            if (enemy.isDead() || !this.isColliding(enemy)) return;
            
            if (this.isJumpingOnEnemy(enemy)) {
                this.killEnemy(enemy, index);
            } else {
                this.damageCharacter();
            }
        });
    }

    isColliding(enemy) {
        return this.character.x + this.character.width > enemy.x &&
               this.character.y + this.character.height > enemy.y &&
               this.character.x < enemy.x + enemy.width &&
               this.character.y < enemy.y + enemy.height;
    }

    isJumpingOnEnemy(enemy) {
        let characterBottom = this.character.y + this.character.height;
        let enemyTop = enemy.y;
        let isFalling = this.character.speedY <= 0;
        let isLandingOnTop = Math.abs(characterBottom - enemyTop) <= 35;
        let isAboveEnemy = this.character.y < enemyTop - 10;
        
        return isFalling && isLandingOnTop && isAboveEnemy;
    }

    killEnemy(enemy, index) {
        this.level.enemies.splice(index, 1);
        this.character.speedY = 15;
    }

    damageCharacter() {
        if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBarHealth.setPercentage(this.character.energy);
        }
    }

    checkBottlesCollisions() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.character.collectBottle(bottle);
                this.level.bottles.splice(this.level.bottles.indexOf(bottle), 1);
                this.statusBarBottles.setBottlesAmount(this.character.collectedBottles);
            }
        });
    }

    checkCoinsCollisions(){
         this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.character.collectCoin(coin);
                this.level.coins.splice(this.level.coins.indexOf(coin), 1);
                this.statusBarCoins.setCoinsAmount(this.character.collectedCoins);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.throwableObject);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.ctx.restore();


        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        this.ctx.translate(this.camera_x, 0);
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
        mo.draw(this.ctx);
        mo.drawBorderFrames(this.ctx);

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