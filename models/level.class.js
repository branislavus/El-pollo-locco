class Level {
    clouds;
    enemies;
    backgroundObjects;
    bottles;
    coins;
    level_end_x = 2160;
    level_end_y = -600;

    constructor(clouds, enemies, backgroundObjects, bottles, coins){
        this.clouds = clouds;
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
    }

}