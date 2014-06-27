/* global SvgUtils: true */

var SvgUtils = {

  widthOf: function (element) {
    return element.g[0][0].getBBox().width;
  },

  heightOf: function (element) {
    return element.g[0][0].getBBox().height;
  },

  getXYFromTranslate : function(translateString) {
    var split = translateString.split(',');
    var x = split[0] ? split[0].split('(')[1] : 0;
    var y = split[1] ? split[1].split(')')[0] : 0;
    return [parseInt(x, 10), parseInt(y, 10)];
  }
  

};