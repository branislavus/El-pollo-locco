class Cloud extends MovableObject {
    height = 200;
    width = 300;
    world;
    leftBorder;
    rightBorder;
    cloudSound = ['onWind'];

constructor() {
    super();
    this.loadImage('img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 2000;
    this.y = Math.random() * 50;
    this.speed = 0.05 + Math.random() * 0.2;
}
setWorld(world) {
    this.world = world;
    this.leftBorder = this.world.level.level_start_x;
    this.rightBorder = this.world.level.level_end_x;
    this.animate();
}

    animate() {
        setInterval(() => {
            this.returnCloudBack();
            this.moveLeft();
            this.playCoudSound();
        }, 1000 / 60);
    }

    returnCloudBack() {
        if (this.x < this.leftBorder) this.x = this.rightBorder;
    }

    playCoudSound(){
       if (Math.abs(this.world.character.x - this.x) < 10) audioManager.onWind();
    }

}