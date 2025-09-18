class Statusbar extends DrawableObject {

   IMAGES_HEALTH_BLUE = [
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
   ];

   percentage = 100;

   constructor() {
      super();
      this.loadImages(this.IMAGES_HEALTH_BLUE);
      this.x = 25;
      this.y = 10;
      this.width = 120;
      this.height = 40;
      this.setPercentage(100);
   }

   setPercentage(percentage) {
      this.percentage = percentage;
      let path = this.IMAGES_HEALTH_BLUE[this.resolveImageIndex()];
      this.img = this.imagePool[path];
   }

   resolveImageIndex() {
      if (this.percentage == 100) {
         return 5;
      } else if (this.percentage > 80) {
         return 4;
      } else if (this.percentage > 60) {
         return 3;
      } else if (this.percentage > 40) {
         return 2;
      } else if (this.percentage > 20) {
         return 1;
      } else {
         return 0;
      }

   }
}