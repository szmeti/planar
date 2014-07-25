/* global ElementFilter: true */
var ElementFilter = (function () {

  function ElementFilter() {
    this.filterName = null;
    this.filterId = null;
    this.elementCount = 0;
    this.activeFlag = true;
    this.elementType = BOTH_FILTER;
    this.labelFilterActivated = false;
    this.initHasConditions();
  }

  utils.mixin(ElementFilter.prototype, HasConditions);

  utils.mixin(ElementFilter.prototype, {

    id: function (value) {
      if (!arguments.length) {
        return this.filterId;
      }
      this.filterId = value;
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

    incrementCount: function (value) {
      value = value || 1;
      this.elementCount += value;
      return this;
    },

    decrementCount: function (value) {
      value = value || 1;
      this.elementCount -= value;
      return this;
    },

    name: function (value) {
      if (!arguments.length) {
        return this.filterName;
      }
      this.filterName = value;
      return this;
    },

    addCondition: function(condition) {
      utils.checkExists('Condition', condition);
      this.hasConditions.push(condition);
      return this;
    },

    label: function () {
      var labels = utils.convertVarArgs(arguments);
      this.hasConditions.push(new LabelCondition(labels));
      this.labelFilterActivated = true;
      this.elementType = EDGE_FILTER;
      return this;
    }

  });

  return ElementFilter;

}());
