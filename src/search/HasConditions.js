/* global HasConditions: true */
var HasConditions = (function () {

  return {

    initHasConditions: function () {
      this.hasConditions = [];
    },

    has: function (key, value1, value2, disabledFilters) {
      disabledFilters = disabledFilters || [];
      if (!utils.isUndefined(value2) && value2 !== null) {
        this.hasConditions.push(new HasCondition(key, value1, value2, disabledFilters));
      } else if (!utils.isUndefined(value1) && value1 !== null) {
        this.hasConditions.push(new HasCondition(key, Compare.EQUAL, value1, disabledFilters));
      } else {
        this.hasConditions.push(new HasCondition(key, Compare.NOT_EQUAL, null, disabledFilters));
      }
      return this;
    },

    hasNot: function (key, value, disabledFilters) {
      disabledFilters = disabledFilters || [];
      if (utils.isUndefined(value) || value === null) {
        this.hasConditions.push(new HasCondition(key, Compare.EQUAL, null, disabledFilters));
      } else {
        this.hasConditions.push(new HasCondition(key, Compare.NOT_EQUAL, value, disabledFilters));
      }
      return this;
    },

    interval: function (key, startValue, endValue, disabledFilters) {
      disabledFilters = disabledFilters || [];
      this.hasConditions.push(new HasCondition(key, Compare.GREATER_THAN_EQUAL, startValue, disabledFilters));
      this.hasConditions.push(new HasCondition(key, Compare.LESS_THAN, endValue, disabledFilters));
      return this;
    }

  };

}());