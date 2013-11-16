/* global Query: true */
var Query = (function () {

  function filterElements(elements, filters, queryLimit, resultExtractor) {
    var count = 0;

    if (!utils.isArray(elements)) {
      elements = [elements];
    }

    var result = [];
    for (var i = 0; i < elements.length; i++) {
      var elementsByIds = elements[i];
      for (var id in elementsByIds) {
        var element = elementsByIds[id];
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

    has: function (key, value1, value2) {
      if (!utils.isUndefined(value2) && value2 !== null) {
        this.hasFilters.push(new HasFilter(key, value1, value2));
      } else if (!utils.isUndefined(value1) && value1 !== null) {
        this.hasFilters.push(new HasFilter(key, Compare.EQUAL, value1));
      } else {
        this.hasFilters.push(new HasFilter(key, Compare.NOT_EQUAL, null));

      }
      return this;
    },

    hasNot: function (key, value) {
      if (utils.isUndefined(value) || value === null) {
        this.hasFilters.push(new HasFilter(key, Compare.EQUAL, null));
      } else {
        this.hasFilters.push(new HasFilter(key, Compare.NOT_EQUAL, value));
      }
      return this;
    },

    interval: function (key, startValue, endValue) {
      this.hasFilters.push(new HasFilter(key, Compare.GREATER_THAN_EQUAL, startValue));
      this.hasFilters.push(new HasFilter(key, Compare.LESS_THAN, endValue));
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
