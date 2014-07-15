/* global Contains: true */
var Contains = (function () {

  return {

    IN: {
      evaluate: function (first, second) {
        utils.checkArray('Second argument', second);
        return utils.indexOf(first, second) > -1;
      }
    },

    HAS_ELEMENT: {
      evaluate: function (first, second) {
        utils.checkArray('First argument', first);
        return utils.indexOf(second, first) > -1;
      }
    },

    NOT_IN: {
      evaluate: function (first, second) {
        utils.checkArray('Second argument', second);
        return utils.indexOf(first, second) === -1;
      }
    }

  };

}());