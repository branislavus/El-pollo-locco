class Cloud extends MovableObject {
    height = 200;
    width = 300;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 800;
        this.y = Math.random() * 50;
         this.speed = 0.05 + Math.random() * 0.2;
        this.animate();
    }

    animate() {
        this.moveLeft();
    }





}