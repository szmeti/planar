/* global Query: true */
var Query = (function () {

  function filterElements(elements, filters, queryLimit, resultExtractor) {
    var count = 0;

    if (!utils.isArray(elements)) {
      elements = [elements];
    }

    var result = [];
    for (var i = 0; i < elements.length; i++) {
      var currentElements = elements[i];
      if (utils.isOfType(elements[i], Vertex) || utils.isOfType(elements[i], Edge)) {
        currentElements = [currentElements];
      }

      for (var id in currentElements) {
        var element = currentElements[id];
        var filtered = false;

        for (var j = 0; j < filters.length; j++) {
          if (!filters[j].matches(element)) {
            filtered = true;
            break;
          }
        }

        if (!filtered) {
          if (++count <= queryLimit) {
            if (resultExtractor) {
              result.push(resultExtractor(element));
            } else {
              result.push(element);
            }
          } else {
            return result;
          }
        }
      }
    }

    return result;
  }

  return {

    initQuery: function () {
      this.queryLimit = Number.MAX_VALUE;
      this.hasFilters = [];
    },

    limit: function (limit) {
      this.queryLimit = limit;
      return this;
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
    },

    edges: function () {
      var elements = this.getInitialEdges();
      var filters = this.getBaseFilters();
      filters = filters.concat(this.hasFilters);
      return filterElements(elements, filters, this.queryLimit);
    },

    vertices: function () {
      var elements = this.getInitialVertices();
      var filters = this.getBaseFilters();
      filters = filters.concat(this.hasFilters);
      return filterElements(elements, filters, this.queryLimit, this.resultExtractor(this));
    }

  };

}());
