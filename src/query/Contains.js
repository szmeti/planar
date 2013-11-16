/* global Contains: true */
var Contains = (function () {

  return {

    IN: {
      evaluate: function (first, second) {
        utils.checkArray('Second argument', second);
        return utils.indexOf(first, second) > -1;
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