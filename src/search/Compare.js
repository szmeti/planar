/* global Compare: true */
var Compare = (function () {

  return {

    EQUAL: {
      evaluate: function (first, second) {
        return first === second;
      },
      displayName: 'Equal to'
    },

    NOT_EQUAL: {
      evaluate: function (first, second) {
        return first !== second;
      },
      displayName: 'Not equal to'
    },

    GREATER_THAN: {
      evaluate: function (first, second) {
        return first !== null && second !== null && first > second;
      },
      displayName: 'Greater than'
    },

    LESS_THAN: {
      evaluate: function (first, second) {
        return first !== null && second !== null && first < second;
      },
      displayName: 'Less than'
    },

    GREATER_THAN_EQUAL: {
      evaluate: function (first, second) {
        return first !== null && second !== null && first >= second;
      },
      displayName: 'Greater than or equal to'
    },

    LESS_THAN_EQUAL: {
      evaluate: function (first, second) {
        return first !== null && second !== null && first <= second;
      },
      displayName: 'Less than or equal to'
    }

  };

}());