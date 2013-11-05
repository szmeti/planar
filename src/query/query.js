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
    },

    limit: function (limit) {
      this.queryLimit = limit;
      return this;
    },

    edges: function () {
      var elements = this.getInitialEdges();
      var filters = this.getBaseFilters();
      return filterElements(elements, filters, this.queryLimit);
    },

    vertices: function () {
      var elements = this.getInitialVertices();
      var filters = this.getBaseFilters();
      return filterElements(elements, filters, this.queryLimit, this.resultExtractor(this));
    }

  };

}());