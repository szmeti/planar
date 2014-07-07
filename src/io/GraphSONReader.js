/* global GraphSONReader: true */
var GraphSONReader = (function () {
  function GraphSONReader() {
    this.a = 1;
  }

  var copyProperties = function (from, to) {
    for (var property in from) {
      to.setProperty(property, from[property]);
    }
  };

  utils.mixin(GraphSONReader.prototype, {
    read: function (graph, graphSON) {
      for(var vertexIndex in graphSON.graph.vertices) {

        var graphSONVertex = graphSON.graph.vertices[vertexIndex];
        var vertex = graph.getVertex(graphSONVertex._id);

        if(!utils.exists(vertex)) {
          vertex = graph.addVertex(graphSONVertex._id);
        }

        copyProperties(graphSONVertex, vertex);
      }

      for(var edgeIndex in graphSON.graph.edges) {

        var graphSONEdge = graphSON.graph.edges[edgeIndex];
        var edge = graph.getEdge(graphSONEdge._id);

        if(!utils.exists(edge)) {
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