/* global GraphSONReader: true */
var GraphSONReader = (function () {

  function GraphSONReader() {
  }

  var copyVertexProperties = function (reader, from, to) {
    for (var property in from) {
      if (reader.RESERVED_KEYS.indexOf(property) === -1) {
        to.setProperty(property, from[property][0].value);
      }
    }
  };

  utils.mixin(GraphSONReader.prototype, GraphSONReaderBase);
  utils.mixin(GraphSONReader.prototype, {
    readVertex: function (graph, graphSONVertex) {
      var vertex = this.getVertex(graph, graphSONVertex.id);

      copyVertexProperties(this, graphSONVertex.properties, vertex);

      if (graphSONVertex.outE) {
        for (var label in graphSONVertex.outE) {
          for (var i = 0; i < graphSONVertex.outE[label].length; i++) {
            var graphSONEdge = graphSONVertex.outE[label][i];
            var edge = graph.addEdge(graphSONEdge.id, vertex, this.getVertex(graph, graphSONEdge.inV), label);
            this.copyProperties(graphSONEdge.properties, edge);
          }
        }
      }
    }
  });

  return GraphSONReader;
}());