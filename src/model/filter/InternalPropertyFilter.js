/* global InternalPropertyFilter: true */
var InternalPropertyFilter = (function () {

  return {

    isVisible: function(element, propertyKey) {
      return propertyKey.indexOf('_') !== 0;
    }

  };

}());
