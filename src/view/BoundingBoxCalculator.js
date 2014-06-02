/* global BoundingBoxCalculator: true */
var BoundingBoxCalculator = (function () {

  function BoundingBoxCalculator() {
    this.width = 0;
  }

  utils.mixin(BoundingBoxCalculator.prototype, {

    addElement: function (element) {
      var elementWidth = element.getBBox().width;
      this.width = elementWidth > this.width ? elementWidth : this.width;
    },

    getWidth: function () {
      return this.width;
    }

  });

  return BoundingBoxCalculator;

}());