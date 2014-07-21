/* global LayoutUtils: true */
var LayoutUtils = {
  setScale: function (scale) {
    d3.select('#graphElements').attr('transform', 'scale(' + scale + ')');
  },

  getScale: function () {
    var graphElements = d3.select('#graphElements');
    if (graphElements.empty()) {
      return 1;
    } else {
      var transform = graphElements.attr('transform');
      return transform.substring(6, transform.length - 1);
    }
  }
};