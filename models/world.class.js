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
    statusBarEndboss = null;
    throwableObject = [];
    lastThrow = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initializeStatusBars();
        this.draw();
        this.setWorld();
        this.run();
        this.showMyInterval();
    }

    initializeStatusBars() {
        // Erstelle Endboss-Statusbar
        this.statusBarEndboss = new StatusBarEndBoss();
    }

    showMyInterval() {
        setInterval(() => {
            this.character.lastCharacterX = this.character.x;
            this.character.isBored();
        }, 1000);
    }



    shouldShowEndbossStatusbar() {
        // Zeige Endboss-Statusbar wenn Character Position x=1000 erreicht
        let shouldShow = this.character.x >= 1300;
        return shouldShow;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.handleThrowableObject();
            this.removeFinishedThrowableObjects();
            this.removeDeadEnemies();
        }, 200);
    }

    removeFinishedThrowableObjects() {
        this.throwableObject = this.throwableObject.filter(obj => !obj.shouldBeRemoved);
    }

    removeDeadEnemies() {
        // Entferne Enemies die shouldBeRemoved haben (wie tote Endboss nach 2 Sekunden)
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.shouldBeRemoved);
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
        this.checkBottleEnemyCollisions();
        this.checkBottlesCollisions();
        this.checkCoinsCollisions();
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy, index) => {
            if (enemy.isDead() || !this.isColliding(enemy)) return;

            if (this.isJumpingOnEnemy(enemy)) {
                this.killEnemy(index);
            } else {
                this.damageCharacter();
            }
        });
    }

    checkBottleEnemyCollisions() {
        this.throwableObject.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (enemy.isDead() || bottle.shouldBeRemoved) return;

                if (this.isBottleCollidingWithEnemy(bottle, enemy)) {
                    this.handleBottleHitEnemy(enemy, bottle);
                }
            });
        });
    }

    isBottleCollidingWithEnemy(bottle, enemy) {
        // Präzisere Kollision - nur wenn Flasche wirklich den Enemy-Kern trifft
        let bottleCenterX = bottle.x + bottle.width / 2;
        let bottleCenterY = bottle.y + bottle.height / 2;

        // Kleinere Kollisions-Zone für Enemies (besonders Endboss)
        let enemyCollisionMargin = this.isEndboss(enemy) ? 50 : 10;
        let enemyLeft = enemy.x + enemyCollisionMargin;
        let enemyRight = enemy.x + enemy.width - enemyCollisionMargin;
        let enemyTop = enemy.y + enemyCollisionMargin;
        let enemyBottom = enemy.y + enemy.height - enemyCollisionMargin;

        return bottleCenterX > enemyLeft &&
            bottleCenterX < enemyRight &&
            bottleCenterY > enemyTop &&
            bottleCenterY < enemyBottom;
    }

    handleBottleHitEnemy(enemy, bottle) {
        // Nur Endboss wird von Flaschen verletzt
        if (this.isEndboss(enemy)) {
            this.hurtEndboss(enemy);
        }

        // Flasche explodiert immer bei Treffer
        bottle.startSplashAnimation();
    }

    isEndboss(enemy) {
        // Prüft ob Enemy ein Endboss ist (z.B. durch Klassename oder Property)
        return enemy.constructor.name === 'Endboss' || enemy.isEndboss === true;
    }

    hurtEndboss(endboss) {
        if (endboss.bossEnergy > 0) {
            endboss.bossEnergy -= 1;
            endboss.hurtImageIndex = 1; // Triggert Hurt-Animation

            // Endboss-Statusbar aktualisieren
            if (this.statusBarEndboss) {
                this.statusBarEndboss.setBossEnergyAmount(endboss.bossEnergy);
            }
        }
    }

    isColliding(enemy) {
        return this.character.x + this.character.width > enemy.x &&
            this.character.y + this.character.height > enemy.y &&
            this.character.x < enemy.x + enemy.width &&
            this.character.y < enemy.y + enemy.height;
    }


    isJumpingOnEnemy(enemy) {
        return this.character.y < enemy.y &&
            this.character.speedY > 0 &&
            this.character.x + this.character.width > enemy.x &&
            this.character.x < enemy.x + enemy.width;
    }

    killEnemy(index) {
        this.level.enemies.splice(index, 1);
        this.character.speedY = 12;

        // Sanftere Korrektur nach kürzerer Zeit
        setTimeout(() => {
            if (this.character.y >= 226) {
                this.character.y = 226; // Korrigiere Y-Position zur Laufhöhe
                this.character.speedY = 0; // Stoppe Bewegung
            } else if (this.character.y < 150) {
                this.character.speedY = 30; // Sanft nach unten
            }
        }, 250); // Frühere Überprüfung
    }



    damageCharacter() {
        if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBarHealth.setPercentage(this.character.energy);
        }
    }

    checkBottlesCollisions() {
        this.checkCollectableCollisions(this.level.bottles, 'collectBottle', this.statusBarBottles, 'setBottlesAmount', 'collectedBottles');
    }

    checkCoinsCollisions() {
        this.checkCollectableCollisions(this.level.coins, 'collectCoin', this.statusBarCoins, 'setCoinsAmount', 'collectedCoins');
    }

    checkCollectableCollisions(items, collectMethod, statusBar, statusMethod, counterProperty) {
        items.forEach((item, index) => {
            if (this.character.isColliding(item)) {
                this.character[collectMethod](item);
                items.splice(index, 1);
                statusBar[statusMethod](this.character[counterProperty]);
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
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObject);

        this.ctx.restore();

        // UI-Elemente (immer im Vordergrund)
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);

        // Endboss-Statusbar nur anzeigen wenn Boss nah genug ist
        if (this.statusBarEndboss && this.shouldShowEndbossStatusbar()) {
            this.addToMap(this.statusBarEndboss);
        }

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
        mo.drawBorderFrames(this.ctx);        // Blaue Original-Rahmen
        mo.drawOffsetFrames(this.ctx);        // Rote Offset-Rahmen
        mo.drawOffsetLineFrames(this.ctx);    // Grüne OffsetLine-Rahmen

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

        // Setze World-Referenz auch für alle Enemies (besonders Endboss)
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

}