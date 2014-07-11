/* global Easing: true */
var Easing = (function () {

  function Easing() {}

  utils.mixin(Easing.prototype, {
    expoinout: function (t, b, c, d) {
      if (t===0) {
        return b;
      }
      if (t===d) {
        return b+c;
      }
      t = t/(d/2);
      if (t < 1) {
        return c/2 * Math.pow(2, 10 * (t - 1)) + b;
      }
      return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  });

  return Easing;
}());