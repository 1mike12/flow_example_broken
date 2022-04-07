export default class UUID {

   /**
    *
    * @param randomFunction random function returning in range [0,1]. Defaults to Math.random
    */
   constructor(private randomFunction = Math.random) {

   }

   private generateRandomNumber(limit) {
      const value = limit * this.randomFunction();
      return value | 0;
   }

   private generateX() {
      const value = this.generateRandomNumber(16);
      return value.toString(16);
   }

   private generateXes(count) {
      let result = '';
      for (let i = 0; i < count; ++i) {
         result += this.generateX();
      }
      return result;
   }

   private generateVariant() {
      const value = this.generateRandomNumber(16);
      const variant = (value & 0x3) | 0x8;
      return variant.toString(16);
   };

   v4() {
      const result = this.generateXes(8)
         + '-' + this.generateXes(4)
         + '-' + '4' + this.generateXes(3)
         + '-' + this.generateVariant() + this.generateXes(3)
         + '-' + this.generateXes(12)
      return result;
   }
}