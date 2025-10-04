class Level {
    clouds;
    enemies;
    backgroundObjects;
    bottles;
    level_end_x = 2160;
    level_end_y = -600;

    constructor(clouds, enemies, backgroundObjects, bottles){
        this.clouds = clouds;
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
    }

}