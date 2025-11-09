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
    gameOver = false;
    gameActive = true;
    drawBorderFramesYes = false;

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
        this.statusBarEndboss = new StatusBarEndBoss();
    }

    showMyInterval() {
        setInterval(() => {
            this.character.lastCharacterX = this.character.x;
            this.character.isBored();
        }, 1000);
    }

    shouldShowEndbossStatusbar() {
        let shouldShow = this.character.x >= 1300;
        return shouldShow;
    }

    run() {
        this.runInterval = setInterval(() => {
            // Stoppe alle Verarbeitungen wenn Spiel vorbei ist
            if (this.gameOver || this.gameActive === false) return;

            this.checkCollisions();
            this.handleThrowableObject();
            this.removeFinishedThrowableObjects();
            this.checkGameOverConditions();
        }, 200);
    }

    checkGameOverConditions() {
        // Prüfe Character Tod
        if (this.character.energy <= 0 && !loseGame && !winGame)
            this.youLoseTheGame();

        // Prüfe Endboss Tod
        let endboss = this.level.enemies.find(enemy => this.isEndboss(enemy));
        if (endboss && endboss.isDead() && !winGame && !loseGame)
            this.youWonTheGame();
    }

    youLoseTheGame() {
        loseGame = true;
        setTimeout(() => {
            endGame();
        }, 6000); // 1 Sekunde Verzögerung für Death-Animation
    }

    youWonTheGame() {
        winGame = true;
        setTimeout(() => {
            endGame();
        }, 4000); // 2 Sekunden Verzögerung für Death-Animation
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
        // Stop enemy collisions if game is over
        if (!this.gameActive || this.gameOver || loseGame || winGame) return;
        this.checkEnemyCollisions();
        this.checkBottleEnemyCollisions();
        this.checkBottlesCollisions();
        this.checkCoinsCollisions();
    }

    checkEnemyCollisions() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            let enemy = this.level.enemies[i];
            if (enemy.isDead() || !this.character.isColliding(enemy)) continue;

            this.isJumpingOnEnemy(enemy) ? this.killEnemy(enemy, i) : this.damageCharacter();
            if (!this.character.isAboveGround()) {
                this.setRightCharecterYPosition();
            }
        }
    }

    setRightCharecterYPosition() {
        if (this.character.y < 226) this.character.y = 226;
    }

    checkBottleEnemyCollisions() {
        this.throwableObject.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (enemy.isDead() || bottle.shouldBeRemoved) return;

                if (this.isBottleCollidingWithEnemy(bottle, enemy)) this.handleBottleHitEnemy(enemy, bottle);
            });
        });
    }

    isBottleCollidingWithEnemy(bottle, enemy) {
        // Einfache Kollisionserkennung - Flasche-Zentrum trifft Gegner
        let bottleCenterX = bottle.x + bottle.width / 2;
        let bottleCenterY = bottle.y + bottle.height / 2;

        // Margin nur für Endboss, Chickens ohne Margin
        let margin = this.isEndboss(enemy) ? 50 : 0;
        let enemyLeft = enemy.x + margin;
        let enemyRight = enemy.x + enemy.width - margin;
        let enemyTop = enemy.y + margin;
        let enemyBottom = enemy.y + enemy.height - margin;

        return bottleCenterX > enemyLeft &&
            bottleCenterX < enemyRight &&
            bottleCenterY > enemyTop &&
            bottleCenterY < enemyBottom;
    }

    handleBottleHitEnemy(enemy, bottle) {
        if (this.isEndboss(enemy)) {
            // Endboss nimmt nur Schaden, verschwindet nicht
            this.hurtEndboss(enemy);
        } else {
            // Normale Gegner werden getötet
            this.killEnemyByBottle(enemy);
        }
        // Starte nur die Animation, Sound wird in startSplashAnimation() abgespielt
        if (!bottle.shouldBeRemoved) {
            bottle.startSplashAnimation();
        }
    }
    isEndboss(enemy) {
        // Prüft ob Enemy ein Endboss ist
        return enemy.constructor.name === 'Endboss' || enemy.isEndboss === true;
    }

    killEnemyByBottle(enemy) {
        // Zeige Todes-Animation
        if (enemy.showDeadChicken)
            enemy.showDeadChicken();

        // Audio für getöteten Gegner
        if (typeof audioManager !== 'undefined')
            audioManager.onChickenSquish();

        // Entferne Gegner nach Animation
        setTimeout(() => {
            let index = this.level.enemies.indexOf(enemy);
            if (index > -1) this.level.enemies.splice(index, 1);
        }, 2000);
    }

    hurtEndboss(endboss) {
        if (endboss.bossEnergy > 0) {
            endboss.bossEnergy -= 1;
            endboss.hurtImageIndex = 1; // Triggert Hurt-Animation (und damit takeDamage())
            this.refreshStatusbarEndboss(endboss);
        }
    }

    refreshStatusbarEndboss(endboss) {
        if (this.statusBarEndboss) this.statusBarEndboss.setBossEnergyAmount(endboss.bossEnergy);
    }

    isJumpingOnEnemy(enemy) {
        // Character Kollisionsbox mit Offset
        let characterLeft = this.character.x + this.character.offset.left;
        let characterRight = this.character.x + this.character.width - this.character.offset.right;
        let characterBottom = this.character.y + this.character.height - this.character.offset.bottom;

        // Enemy Kollisionsbox (falls Enemy auch Offset hat, sonst normale Werte)
        let enemyLeft = enemy.x + (enemy.offset ? enemy.offset.left : 0);
        let enemyRight = enemy.x + enemy.width - (enemy.offset ? enemy.offset.right : 0);
        let enemyTop = enemy.y + (enemy.offset ? enemy.offset.top : 0);

        let isFalling = this.character.speedY <= 0;
        let isLandingOnTop = Math.abs(characterBottom - enemyTop) <= 50;
        let isAboveEnemy = characterBottom < enemyTop + 20;
        let isHorizontallyOverlapping = characterRight > enemyLeft && characterLeft < enemyRight;

        return isFalling && isLandingOnTop && isAboveEnemy && isHorizontallyOverlapping;
    }

    killEnemy(enemy, index) {
        // Character jumps up
        this.character.speedY = 10;

        // 3. Stop enemy sounds immediately
        if (enemy.audio && enemy.audio.sounds) {
            Object.values(enemy.audio.sounds).forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        }

        // 1. Show enemy death animation
        if (enemy.showDeadChicken) enemy.showDeadChicken();

        // 2. Play sound for defeated enemy
        if (typeof audioManager !== 'undefined') audioManager.onChickenSquish();

        // 4. Remove enemy from array after 2 seconds
        setTimeout(() => {
            this.level.enemies.splice(index, 1);
        }, 2000);
    }

    damageCharacter() {
        if (!this.character.isHurt()) {
            this.character.hit();
            // Sound sofort abspielen beim Schaden
            if (typeof audioManager !== 'undefined') audioManager.onHurt();
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
            if (this.character.isCollidingOffset(item)) {
                this.collectItem(item, index, items, collectMethod);
                this.updateStatusBar(statusBar, statusMethod, counterProperty);
            }
        });
    }

    collectItem(item, index, items, collectMethod) {
        this.character[collectMethod](item);
        items.splice(index, 1);
        this.playCollectSound(collectMethod);
    }

    playCollectSound(collectMethod) {
        if (collectMethod === 'collectBottle') {
            if (typeof audioManager !== 'undefined') audioManager.onBottle();
        }
        if (collectMethod === 'collectCoin') {
            if (typeof audioManager !== 'undefined') audioManager.onCoin();
        }
    }

    updateStatusBar(statusBar, statusMethod, counterProperty) {
        statusBar[statusMethod](this.character[counterProperty]);
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
        this.drawBorderFramesStart();
        if (mo.characterDirectionLeft) {
            this.flipImageBack(mo);
        }
    }

    drawBorderFramesStart() {
        if (this.drawBorderFramesYes) {
            mo.drawBorderFrames(this.ctx);
            mo.drawOffsetFrames(this.ctx);
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
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
        this.level.clouds.forEach(cloud => {
            cloud.setWorld(this);
        });
    }

}