/* global DomUtils: true */

var DomUtils = {

  traverse: function (domElement, callbackForElements, context) {
    callbackForElements(domElement, context);
    domElement = domElement.firstChild;
    while (domElement) {
      this.traverse(domElement, callbackForElements, context);
      domElement = domElement.nextSibling;
    }
  },

  convertImgToBase64: function(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
      ctx = canvas.getContext('2d'),
      img = new Image();
    img.onload = function () {
      var dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(this, dataURL);
      canvas = null;
    };
    img.src = url;
  },

  explicitlySetStyle: function (element) {
    if (element.nodeType !== window.Node.ELEMENT_NODE) {
      return;
    }
    var computedStyle = getComputedStyle(element);
    var computedStyleStr = '';
    for (var i = 0; i < computedStyle.length; i++) {
      var key = computedStyle[i];
      var value = computedStyle.getPropertyValue(key);
      computedStyleStr += key + ':' + value + ';';
    }
    element.setAttribute('style', computedStyleStr);
  }

};