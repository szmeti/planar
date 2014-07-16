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
      var edges = this.graph.indexManager.fetchFirstMatching(Edge, this.hasConditions);

      if (!edges) {
        edges = this.graph.edges;
      }

      return edges;
    },

    getInitialVertices: function () {
      var vertices = this.graph.indexManager.fetchFirstMatching(Vertex, this.hasConditions);

      if (!vertices) {
        vertices = this.graph.vertices;
      }

      return vertices;
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