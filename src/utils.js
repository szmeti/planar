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

  remove: function (needle, haystack) {
    var removed = false;

    var index = this.indexOf(needle, haystack);
    if (index >= 0) {
      haystack.splice(index, 1);
      removed = true;
    }

    return removed;
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

  checkExists: function (name, obj) {
    if (utils.isUndefined(obj) || obj === null) {
      throw {
        message: name + ' must be specified'
      };
    }
  },

  checkInArray: function (name, obj, array) {
    this.checkExists(name, obj);
    if (this.indexOf(obj, array) === -1) {
      throw {
        message: name + ' must be one of ' + array
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

  generateId: (function () {
    var id = 1;
    return function () {
      return id++;
    };
  })(),

  convertVarArgs: function(args) {
    return args.length > 0 && utils.isArray(args[0]) ? args[0] : Array.prototype.slice.call(args);
  }

};