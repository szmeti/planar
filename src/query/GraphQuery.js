/* global GraphQuery: true */
var GraphQuery = (function () {

  function GraphQuery(graph) {
    utils.checkExists('Graph', graph);
    this.initQuery();
    this.graph = graph;
  }

  utils.mixin(GraphQuery.prototype, Query);

  utils.mixin(GraphQuery.prototype, {

    getInitialEdges: function () {
      return this.graph.edges;
    },

    getInitialVertices: function () {
      return this.graph.vertices;
    },

    getBaseFilters: function () {
      return [];
    },

    resultExtractor: function () {
      return function (vertex) {
        return vertex;
      };
    }

  });

  return GraphQuery;

}());