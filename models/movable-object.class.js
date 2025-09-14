class MovableObject {
    x = 100;
    y = 225;
    img;
    imagePool = {};
    height = 100;
    width = 100;
    speed = 0.15;
    characterDirectionLeft = false;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imagePool[path] = path;
        });


    }

    moveRight() {
        setInterval(() => {
            this.x += this.speed;
        }, 1000 / 60);
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}