let canvas;
let world;
let keybord = new Keybord();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keybord);

    console.log('My Character is: ', world.character);
    console.log('Enemy is: ', world.enemies);

}

window.addEventListener("keydown", (e) => {
    if(e.keyCode == 39){
        keybord.RIGHT = true
    }
     if(e.keyCode == 37){
        keybord.LEFT = true
    }
     if(e.keyCode == 32){
        keybord.SPACE = true
    }
     if(e.keyCode == 38){
        keybord.UP = true
    }
     if(e.keyCode == 40){
        keybord.DOWN = true
    }
});

window.addEventListener("keyup", (e) => {
     if(e.keyCode == 39){
        keybord.RIGHT = false
    }
     if(e.keyCode == 37){
        keybord.LEFT = false
    }
     if(e.keyCode == 32){
        keybord.SPACE = false
    }
     if(e.keyCode == 38){
        keybord.UP = false
    }
     if(e.keyCode == 40){
        keybord.DOWN = false
    }
});