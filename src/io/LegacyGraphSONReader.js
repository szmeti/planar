/* global LegacyGraphSONReader: true */
var LegacyGraphSONReader = (function () {

  function LegacyGraphSONReader() {
  }

  utils.mixin(LegacyGraphSONReader.prototype, GraphSONReaderBase);
  utils.mixin(LegacyGraphSONReader.prototype, {
    readVertex: function (graph, graphSONVertex) {
      var vertex = this.getVertex(graph, graphSONVertex._id);

      this.copyProperties(graphSONVertex, vertex);
    },

    readEdge: function (graph, graphSONEdge) {
      var edge = graph.getEdge(graphSONEdge._id);

      if (!utils.exists(edge)) {
        var outV = graph.getVertex(graphSONEdge._outV);
        var inV = graph.getVertex(graphSONEdge._inV);
        edge = graph.addEdge(graphSONEdge._id, outV, inV, graphSONEdge._label);
      }

      this.copyProperties(graphSONEdge, edge);
    }
  });

  return LegacyGraphSONReader;
}());