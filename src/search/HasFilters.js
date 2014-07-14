/* global HasFilters: true */
var HasFilters = (function () {

  return {

    initHasFilters: function () {
      this.hasFilters = [];
    },

    has: function (key, value1, value2, disabledFilters) {
      disabledFilters = disabledFilters || [];
      if (!utils.isUndefined(value2) && value2 !== null) {
        this.hasFilters.push(new HasFilter(key, value1, value2, disabledFilters));
      } else if (!utils.isUndefined(value1) && value1 !== null) {
        this.hasFilters.push(new HasFilter(key, Compare.EQUAL, value1, disabledFilters));
      } else {
        this.hasFilters.push(new HasFilter(key, Compare.NOT_EQUAL, null, disabledFilters));
      }
      return this;
    },

    hasNot: function (key, value, disabledFilters) {
      disabledFilters = disabledFilters || [];
      if (utils.isUndefined(value) || value === null) {
        this.hasFilters.push(new HasFilter(key, Compare.EQUAL, null, disabledFilters));
      } else {
        this.hasFilters.push(new HasFilter(key, Compare.NOT_EQUAL, value, disabledFilters));
      }
      return this;
    },

    interval: function (key, startValue, endValue, disabledFilters) {
      disabledFilters = disabledFilters || [];
      this.hasFilters.push(new HasFilter(key, Compare.GREATER_THAN_EQUAL, startValue, disabledFilters));
      this.hasFilters.push(new HasFilter(key, Compare.LESS_THAN, endValue, disabledFilters));
      return this;
    }

  };

}());