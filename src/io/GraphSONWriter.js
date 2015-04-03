/* global GraphSONWriter: true */
var GraphSONWriter = (function () {
  function GraphSONWriter() {
  }

  function copyProperties(element, graphSONElement, excludedProperties) {
    var propertyKeys = element.getPropertyKeys();

    for (var j = 0; j < propertyKeys.length; j++) {
      var propertyKey = propertyKeys[j];
      var property = element.getPropertyUnfiltered(propertyKey);

      if (excludedProperties.indexOf(propertyKey) === -1) {
        graphSONElement[propertyKey] = property;
      }
    }
  }

  function addGraphSONVertices(graph, graphSON, excludedProperties) {
    var vertices = graph.getVertices();
    for (var i = 0; i < vertices.length; i++) {
      var vertex = vertices[i];
      var graphSONVertex = {};
      graphSONVertex[ID] = vertex.id;
      copyProperties(vertex, graphSONVertex, excludedProperties);
      graphSON.vertices.push(graphSONVertex);
    }
  }

  function addGraphSONEdges(graph, graphSON, excludedProperties) {
    var edges = graph.getEdges();
    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      var graphSONEdge = {};
      graphSONEdge[ID] = edge.id;
      graphSONEdge[LABEL] = edge.label;
      graphSONEdge[IN_V] = edge.getVertex(IN).id;
      graphSONEdge[OUT_V] = edge.getVertex(OUT).id;
      copyProperties(edge, graphSONEdge, excludedProperties);
      graphSON.edges.push(graphSONEdge);
    }
  }

  utils.mixin(GraphSONWriter.prototype, {
    write: function (graph, excludedVertexProperties, excludedEdgeProperties, mode) {
      if (!utils.exists(excludedVertexProperties)) {
        excludedVertexProperties = [];
      }

      if (!utils.exists(excludedEdgeProperties)) {
        excludedEdgeProperties = [];
      }

      if (!utils.exists(mode)) {
        mode = 'NORMAL';
      }

      var graphSON = {
        mode: mode,
        vertices: [],
        edges: []
      };

      addGraphSONVertices(graph, graphSON, excludedVertexProperties);
      addGraphSONEdges(graph, graphSON, excludedEdgeProperties);

      return graphSON;
    }
  });

  return GraphSONWriter;
}());