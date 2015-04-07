/* global GraphSONReader: true */
var GraphSONReader = (function () {

  var RESERVED_KEYS = ['_id', '_type', '_label', '_outV', '_inV'];

  function GraphSONReader() {
  }

  var copyProperties = function (from, to) {
    for (var property in from) {
      if (RESERVED_KEYS.indexOf(property) === -1) {
        to.setProperty(property, from[property]);
      }
    }
  };

  utils.mixin(GraphSONReader.prototype, {
    read: function (graph, graphSON) {
      for (var i = 0; i < graphSON.graph.vertices.length; i++) {
        var graphSONVertex = graphSON.graph.vertices[i];
        var vertex = graph.getVertex(graphSONVertex._id);

        if (!utils.exists(vertex)) {
          vertex = graph.addVertex(graphSONVertex._id);
        }

        copyProperties(graphSONVertex, vertex);
      }

      for (i = 0; i < graphSON.graph.edges.length; i++) {
        var graphSONEdge = graphSON.graph.edges[i];
        var edge = graph.getEdge(graphSONEdge._id);

        if (!utils.exists(edge)) {
          var outV = graph.getVertex(graphSONEdge._outV);
          var inV = graph.getVertex(graphSONEdge._inV);
          edge = graph.addEdge(graphSONEdge._id, outV, inV, graphSONEdge._label);
        }

        copyProperties(graphSONEdge, edge);
      }

      return graph;
    }
  });

  return GraphSONReader;
}());