class Statusbar extends DrawableObject  {

   IMAGES_HEALTH_BLUE = [
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
   ];
   IMAGES_HEALTH_GREEN = [
      'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
   ];
   IMAGES_HEALTH_ORANGE = [
      'img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png'
   ];

   percentage = 100;

   constructor() {
      super();
      this.loadImages(this.IMAGES_HEALTH_BLUE);
      this.x = 100;
      this.y = 100;
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