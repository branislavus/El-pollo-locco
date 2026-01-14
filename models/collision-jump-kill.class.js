class CollisionJumpKill {

    /**
     * Creates a new CollisionJumpKill instance.
     * @param {World} world - Reference to the world instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks if character is jumping on enemy.
     * @param {MovableObject} enemy - Enemy to check collision with.
     * @returns {boolean} True if character is landing on enemy from above.
     */
    isJumpingOnEnemy(enemy) {
        const characterBox = this.getCharacterCollisionBox();
        const enemyBox = this.getEnemyCollisionBox(enemy);
        return this.isValidJumpKill(characterBox, enemyBox);
    }

    /**
     * Gets character collision box with offset.
     * @returns {Object} Character collision boundaries.
     */
    getCharacterCollisionBox() {
        return {
            left: this.world.character.x + this.world.character.offset.left,
            right: this.world.character.x + this.world.character.width - this.world.character.offset.right,
            bottom: this.world.character.y + this.world.character.height - this.world.character.offset.bottom
        };
    }

    /**
     * Gets enemy collision box with offset.
     * @param {MovableObject} enemy - Enemy to get collision box for.
     * @returns {Object} Enemy collision boundaries.
     */
    getEnemyCollisionBox(enemy) {
        return {
            left: enemy.x + (enemy.offset ? enemy.offset.left : 0),
            right: enemy.x + enemy.width - (enemy.offset ? enemy.offset.right : 0),
            top: enemy.y + (enemy.offset ? enemy.offset.top : 0)
        };
    }

    /**
     * Validates if jump kill conditions are met.
     * @param {Object} characterBox - Character collision box.
     * @param {Object} enemyBox - Enemy collision box.
     * @returns {boolean} True if all jump kill conditions are satisfied.
     */
    isValidJumpKill(characterBox, enemyBox) {
        const isFalling = this.world.character.speedY <= 0;
        const isLandingOnTop = Math.abs(characterBox.bottom - enemyBox.top) <= 60;
        const isAboveEnemy = characterBox.bottom < enemyBox.top + 0;
        const isHorizontallyOverlapping =
            characterBox.right > enemyBox.left &&
            characterBox.left < enemyBox.right;
        return isFalling && isLandingOnTop && isAboveEnemy && isHorizontallyOverlapping;
    }

    /**
     * Collects all enemies that can be killed by jump.
     * @returns {Array} Array of objects with enemy and index.
     */
    collectJumpKillableEnemies() {
        const enemiesToKill = [];
        for (let i = this.world.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.world.level.enemies[i];
            if (enemy.isDead() || !this.world.character.isCollidingOffset(enemy)) continue;
            if (this.isJumpingOnEnemy(enemy)) 
                enemiesToKill.push({ enemy, index: i });           
        }
        return enemiesToKill;
    }

    /**
     * Executes jump kill on collected enemies.
     * @param {Array} enemiesToKill - Array of enemies to kill.
     * @param {CollisionManager} collisionManager - Reference to collision manager.
     */
    executeJumpKills(enemiesToKill, collisionManager) {
        enemiesToKill.forEach(({ enemy, index }) => {
            collisionManager.killEnemy(enemy, index);
        });
    }
}
