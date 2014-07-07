/* global utils: true */

var utils = {

  mixin: function (target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
    return target;
  },

  indexOf: function (needle, haystack) {
    if (needle) {
      for (var i = 0; i < haystack.length; i++) {
        if (haystack[i] === needle) {
          return i;
        }
      }
    }

    return -1;
  },

  indexOfById: function (id, haystack) {
    if (id) {
      for (var i = 0; i < haystack.length; i++) {
        if (haystack[i].id === id) {
          return i;
        }
      }
    }

    return -1;
  },

  remove: function (needle, haystack) {
    var removed = false;

    var index = this.indexOf(needle, haystack);
    if (index >= 0) {
      haystack.splice(index, 1);
      removed = true;
    }

    return removed;
  },

  removeById: function (id, haystack) {
    var removed = false;

    var index = this.indexOfById(id, haystack);
    if (index >= 0) {
      haystack.splice(index, 1);
      removed = true;
    }

    return removed;
  },

  keys: function (obj) {
    var keys = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  },

  select: function (haystack, excludedElements) {
    var elements = [];

    for (var key in haystack) {
      if (haystack.hasOwnProperty(key) && utils.indexOf(key, excludedElements) === -1) {
        elements.push(haystack[key]);
      }
    }

    return elements;
  },

  get: function () {
    var args = this.convertVarArgs(arguments);
    var current = args[0];
    args.shift();
    var keys = args;

    for (var i = 0; i < keys.length; ++i) {
      if (this.isUndefined(current[keys[i]])) {
        return undefined;
      } else {
        current = current[keys[i]];
      }
    }

    return current;
  },

  values: function (obj) {
    var values = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        values.push(obj[key]);
      }
    }
    return values;
  },

  isFunction: function (obj) {
    return typeof obj === 'function';
  },

  isUndefined: function (obj) {
    return typeof obj === 'undefined';
  },

  isArray: function (value) {
    return Object.prototype.toString.apply(value) === '[object Array]';
  },

  isOfType: function (obj, type) {
    return obj.constructor === type;
  },

  checkExists: function (name, obj) {
    if (!utils.exists(obj)) {
      throw {
        message: name + ' must be specified'
      };
    }
  },

  exists: function (obj) {
    return !utils.isUndefined(obj) && obj !== null;
  },

  checkInArray: function (name, obj, array) {
    this.checkExists(name, obj);
    if (this.indexOf(obj, array) === -1) {
      throw {
        message: name + ' must be one of ' + array
      };
    }
  },

  checkArray: function (name, array) {
    if (!this.isArray(array)) {
      throw {
        message: name + ' must be an array'
      };
    }
  },

  checkNotEmpty: function (name, obj) {
    if (obj === '') {
      throw {
        message: name + ' must not be empty'
      };
    }
  },

  checkType: function (name, obj, type) {
    if (!this.isOfType(obj, type)) {
      throw {
        message: name + ' must be of type ' + type
      };
    }
  },

  generateId: (function () {
    var id = 1;
    return function () {
      return id++;
    };
  })(),

  convertVarArgs: function (args) {
    return args.length > 0 && utils.isArray(args[0]) ? args[0] : Array.prototype.slice.call(args);
  },

  randomInteger: function (lower, upper) {
    return Math.floor(Math.random() * upper) + lower;
  },

  traverse: function (obj, func, ctx) {
    func(obj, ctx);
    obj = obj.firstChild;
    while (obj) {
      this.traverse(obj, func, ctx);
      obj = obj.nextSibling;
    }
  },

  convertImgToBase64: function(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
      ctx = canvas.getContext('2d'),
      img = new Image();
    img.crossOrigin = 'Anonymous';
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
    if (element.nodeType !== 1) {
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