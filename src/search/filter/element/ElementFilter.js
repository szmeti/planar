/* global ElementFilter: true */
var ElementFilter = (function () {

  function ElementFilter() {
    this.filterName = null;
    this.elementCount = 0;
    this.activeFlag = true;
    this.elementType = BOTH_FILTER;
    this.initHasFilters();
  }

  utils.mixin(ElementFilter.prototype, HasFilters);

  utils.mixin(ElementFilter.prototype, {

    active: function (value) {
      if (!arguments.length) {
        return this.activeFlag;
      }
      this.activeFlag = value;
      return this;
    },

    type: function (value) {
      if (!arguments.length) {
        return this.elementType;
      }
      this.elementType = value;
      return this;
    },

    count: function (value) {
      if (!arguments.length) {
        return this.elementCount;
      }
      this.elementCount = value;
      return this;
    },

    name: function (value) {
      if (!arguments.length) {
        return this.filterName;
      }
      this.filterName = value;
      return this;
    }
  });

  return ElementFilter;

}());
