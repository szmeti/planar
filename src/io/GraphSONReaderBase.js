/* global GraphSONReaderBase: true */
var GraphSONReaderBase = (function () {

  return {
    RESERVED_KEYS: ['_id', '_type', '_label', '_outV', '_inV'],

    read: function (graph, graphSON) {
      this.readVertices(graph, graphSON);
      this.readEdges(graph, graphSON);
      return graph;
    },

    readVertices: function (graph, graphSON) {
      if (graphSON.graph.vertices) {
        for (var i = 0; i < graphSON.graph.vertices.length; i++) {
          var graphSONVertex = graphSON.graph.vertices[i];
          this.readVertex(graph, graphSONVertex);
        }
      }
    },

    readVertex: function (graph, graphSONVertex) {

    },

    readEdges: function (graph, graphSON) {
      if (graphSON.graph.edges) {
        for (var i = 0; i < graphSON.graph.edges.length; i++) {
          var graphSONEdge = graphSON.graph.edges[i];
          this.readEdge(graph, graphSONEdge);
        }
      }
    },

    readEdge: function (graph, graphSONEdge) {

    },

    getVertex: function (graph, id) {
      var vertex = graph.getVertex(id);

      if (!utils.exists(vertex)) {
        vertex = graph.addVertex(id);
      }

      return vertex;
    },

    copyProperties: function (from, to) {
      for (var property in from) {
        if (this.RESERVED_KEYS.indexOf(property) === -1) {
          to.setProperty(property, from[property]);
        }
      }
    }
  };

}());