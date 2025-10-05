const level1 = new Level(
    [
        new Cloud(),
        new Cloud(),
        new Cloud()
    ],
    [
        new ChickenSmall(),
        // new Chicken(),
        // new Chicken(),
        new Endboss()
    ],
    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/air.png', 1),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 1),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 1),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 1),
        new BackgroundObject('img/5_background/layers/air.png', 720),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/air.png', 720*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720*2),
        new BackgroundObject('img/5_background/layers/air.png', 720*3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720*3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720*3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720*3)
    ],
    [
        new Bottles(300, 362),
        new Bottles(600, 362),
        new Bottles(900, 362),
        new Bottles(1200, 362),
        new Bottles(1500, 362)
    ],
     [
        new Coins(300, 200),
        new Coins(300, 150),
        new Coins(300, 100),
        new Coins(300, 50),
        new Coins(600, 150),
        new Coins(650, 100),
        new Coins(700, 80),
        new Coins(750, 100),
        new Coins(800, 150),
        new Coins(1200, 200),
        new Coins(1200, 150),
        new Coins(1200, 100),
        new Coins(1200, 50),
        new Coins(1580, 200),
        new Coins(1600, 150),
        new Coins(1650, 100),
        new Coins(1700, 80),
        new Coins(1750, 100),
        new Coins(1800, 150),
         new Coins(1820, 200)
    ]
);