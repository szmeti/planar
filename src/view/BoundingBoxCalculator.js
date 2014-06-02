/* global BoundingBoxCalculator: true */
var BoundingBoxCalculator = (function () {

  function BoundingBoxCalculator(padding, lineHeight, numberOfLines) {
    this.width = 0;
    this.padding = padding || 0;
    this.lineHeight = lineHeight || 0;
    this.numberLines = numberOfLines || 0;
    this.heightWithPadding = lineHeight * numberOfLines + 2 * padding;
  }

  utils.mixin(BoundingBoxCalculator.prototype, {

    addElement: function (element) {
      var elementWidth = element.getBBox().width;
      this.width = elementWidth > this.width ? elementWidth : this.width;
    },

    leftEdge: function () {
      return -this.totalWidth() / 2;
    },

    rightEdge: function () {
      return this.totalWidth() / 2;
    },

    topEdge: function() {
      return -this.heightWithPadding / 2;
    },

    bottomEdge: function() {
      return this.heightWithPadding / 2;
    },

    totalWidth: function () {
      return this.width + this.padding * 2;
    },

    totalHeight: function () {
      return this.heightWithPadding;
    }

  });

  return BoundingBoxCalculator;

}());