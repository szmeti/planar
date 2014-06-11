/* global SvgUtils: true */

var SvgUtils = {

  widthOf: function (element) {
    return element.g[0][0].getBBox().width;
  },

  heightOf: function (element) {
    return element.g[0][0].getBBox().height;
  }

};