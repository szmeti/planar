/* global ElementFilter: true */
var ElementFilter = (function () {

  function ElementFilter() {
    this.filterName = null;
    this.id = null;
    this.elementCount = 0;
    this.activeFlag = true;
    this.elementType = BOTH_FILTER;
    this.labelFilterActivated = false;
    this.initHasFilters();
  }

  utils.mixin(ElementFilter.prototype, HasFilters);

  utils.mixin(ElementFilter.prototype, {

    id: function (value) {
      if (!arguments.length) {
        return this.id;
      }
      this.id = value;
      return this;
    },

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
      utils.checkArgument(
        !this.labelFilterActivated || value === EDGE_FILTER,
        'If label filter added the type could not be changed.');
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
    },

    label: function () {
      var labels = utils.convertVarArgs(arguments);
      this.hasFilters.push(new LabelFilter(labels));
      this.labelFilterActivated = true;
      this.elementType = EDGE_FILTER;
      return this;
    }

  });

  return ElementFilter;

}());
