/* global Compare: true */
var Compare = (function () {

  return {

    EQUAL: {
      evaluate: function (first, second) {
        return first === second;
      }
    },

    NOT_EQUAL: {
      evaluate: function (first, second) {
        return first !== second;
      }
    },

    GREATER_THAN: {
      evaluate: function (first, second) {
        return first !== null && second !== null && first > second;
      }
    },

    LESS_THAN: {
      evaluate: function (first, second) {
        return first !== null && second !== null && first < second;
      }
    },

    GREATER_THAN_EQUAL: {
      evaluate: function (first, second) {
        return first !== null && second !== null && first >= second;
      }
    },

    LESS_THAN_EQUAL: {
      evaluate: function (first, second) {
        return first !== null && second !== null && first <= second;
      }
    }

  };

}());