class StatusBarHealth extends DrawableObject {

   percentage = 100;

   IMAGES_HEALTH_BLUE = [
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/10.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/30.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/50.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/70.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/90.png',
      'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
   ];


   /**
    * Creates a new StatusBarHealth instance and initializes position.
    */
   constructor() {
      super();
      this.loadImages(this.IMAGES_HEALTH_BLUE);
      this.x = 25;
      this.y = 10;
      this.width = 120;
      this.height = 40;
      this.setPercentage(100);
   }


   /**
    * Sets the health percentage and updates the displayed image.
    * @param {number} percentage - The health percentage (0-100).
    */
   setPercentage(percentage) {
      this.percentage = percentage;
      let path = this.IMAGES_HEALTH_BLUE[this.resolveImageIndex()];
      this.img = this.imagePool[path];
   }


   /**
    * Resolves the image index based on current health percentage.
    * Maps 0-100% to image indices 0-10 in 10% steps.
    * @returns {number} The image index (0-10).
    */
   resolveImageIndex() {
      if (this.percentage <= 0) {
         return 0;
      } else if (this.percentage <= 10) {
         return 1;
      } else if (this.percentage <= 20) {
         return 2;
      } else if (this.percentage <= 30) {
         return 3;
      } else if (this.percentage <= 40) {
         return 4;
      } else if (this.percentage <= 50) {
         return 5;
      } else if (this.percentage <= 60) {
         return 6;
      } else if (this.percentage <= 70) {
         return 7;
      } else if (this.percentage <= 80) {
         return 8;
      } else if (this.percentage <= 90) {
         return 9;
      } else {
         return 10;
      }
   }
}