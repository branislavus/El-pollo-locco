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
    collisionManager;
    renderer;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initializeManagers();
        this.initializeStatusBars();
        this.renderer.draw();
        this.setWorld();
        this.run();
        this.showMyInterval();
    }

    /**
     * Initializes collision manager and renderer.
     */
    initializeManagers() {
        this.collisionManager = new CollisionManager(this);
        this.renderer = new WorldRenderer(this);
    }

    /**
     * Initializes all status bars including endboss status bar.
     */
    initializeStatusBars() {
        this.statusBarEndboss = new StatusBarEndBoss();
    }

    /**
     * Starts interval to track character movement and trigger bored animation.
     */
    showMyInterval() {
        setInterval(() => {
            this.character.lastCharacterX = this.character.x;
            this.character.isBored();
        }, 1000);
    }

    /**
     * Checks if endboss status bar should be displayed.
     * @returns {boolean} True if character is close enough to endboss.
     */
    shouldShowEndbossStatusbar() {
        let shouldShow = this.character.x >= 1300;
        return shouldShow;
    }

    /**
     * Starts main game loop checking collisions and game state.
     */
    run() {
        this.runInterval = setInterval(() => {
            if (this.gameOver || this.gameActive === false) return;

            this.handleThrowableObject();
            this.removeFinishedThrowableObjects();
            this.checkGameOverConditions();
        }, 200);
    }

    /**
     * Checks win/lose conditions and triggers game end.
     */
    checkGameOverConditions() {
        if (this.character.energy <= 0 && !loseGame && !winGame)
            this.youLoseTheGame();

        let endboss = this.level.enemies.find(enemy => this.isEndboss(enemy));
        if (endboss && endboss.isDead() && !winGame && !loseGame)
            this.youWonTheGame();
    }

    /**
     * Triggers game over sequence when player loses.
     */
    youLoseTheGame() {
        loseGame = true;
        setTimeout(() => {
            endGame();
        }, 6000);
    }

    /**
     * Triggers victory sequence when player wins.
     */
    youWonTheGame() {
        winGame = true;
        setTimeout(() => {
            endGame();
        }, 4000);
    }

    /**
     * Removes bottles marked for deletion from throwable objects array.
     */
    removeFinishedThrowableObjects() {
        this.throwableObject = this.throwableObject.filter(obj => !obj.shouldBeRemoved);
    }

    /**
     * Handles bottle throwing action when D key is pressed.
     */
    handleThrowableObject() {
        if (this.canThrow()) {
            let bottle = new ThrowableObject(this.character.x + 40, this.character.y + 60, this.character.characterDirectionLeft);
            this.throwableObject.push(bottle);
            this.lastThrow = new Date().getTime();
            this.collectedBottlesCorrection();
            this.character.lastMove = new Date().getTime();
        }
    }

    /**
     * Checks if character can throw a bottle.
     * @returns {boolean} True if conditions for throwing are met.
     */
    canThrow() {
        return this.keyboard.D && !this.isThrown() && this.character.collectedBottles > 0;
    }

    /**
     * Checks if bottle was recently thrown (cooldown check).
     * @returns {boolean} True if less than 2 seconds since last throw.
     */
    isThrown() {
        let timePast = new Date().getTime() - this.lastThrow;
        timePast = timePast / 1000;
        return timePast < 2;
    }

    /**
     * Decrements collected bottles count and updates status bar.
     */
    collectedBottlesCorrection() {
        this.character.collectedBottles -= 1;
        this.statusBarBottles.setBottlesAmount(this.character.collectedBottles);
    }

    /**
     * Main collision checking coordinator for all collision types.
     */
    checkCollisions() {
        this.collisionManager.checkAllCollisions();
    }

    /**
     * Checks if enemy is an endboss.
     * @param {MovableObject} enemy - Enemy to check.
     * @returns {boolean} True if enemy is endboss.
     */
    isEndboss(enemy) {
        return enemy.constructor.name === 'Endboss' || enemy.isEndboss === true;
    }

    /**
     * Resets character Y position to ground level.
     */
    setRightCharecterYPosition() {
        if (this.character.y < 226) this.character.y = 226;
    }

    /**
     * Sets world reference for all interactive objects.
     * Allows objects to communicate with the world.
     */
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