/* global LayoutUtils: true */
var LayoutUtils = {
  setScale: function (scale) {
    d3.select('#graphElements').attr('transform', 'scale(' + scale + ')');
  }
};