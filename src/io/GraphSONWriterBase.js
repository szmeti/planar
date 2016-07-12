/* global GraphSONWriterBase: true */
var GraphSONWriterBase = (function () {

  function addGraphSONVertices(writer, graph, graphSON, excludedVertexProperties, excludedEdgeProperties) {
    var vertices = graph.getVertices();
    for (var i = 0; i < vertices.length; i++) {
      var vertex = vertices[i];
      var graphSONVertex = {};
      writer.writeVertex(vertex, graphSONVertex, excludedVertexProperties, excludedEdgeProperties);
      graphSON.vertices.push(graphSONVertex);
    }
  }

  function addGraphSONEdges(writer, graph, graphSON, excludedVertexProperties, excludedEdgeProperties) {
    var edges = graph.getEdges();
    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      var graphSONEdge = {};
      writer.writeEdge(edge, graphSONEdge, excludedVertexProperties, excludedEdgeProperties);

      if (graphSON.edges) {
        graphSON.edges.push(graphSONEdge);
      }
    }
  }

  return {
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

      var graphSON = this.getTemplate(mode);

      addGraphSONVertices(this, graph, graphSON, excludedVertexProperties, excludedEdgeProperties);
      addGraphSONEdges(this, graph, graphSON, excludedVertexProperties, excludedEdgeProperties);

      return graphSON;
    },

    getTemplate: function (mode) {

    },

    writeVertex: function (sourceVertex, graphSONVertex, excludedVertexProperties, excludedEdgeProperties) {

    },

    writeEdge: function (sourceEdge, graphSONEdge, excludedVertexProperties, excludedEdgeProperties) {

    },

    copyProperties: function (element, graphSONElement, excludedProperties) {
      var propertyKeys = element.getPropertyKeys();

      for (var j = 0; j < propertyKeys.length; j++) {
        var propertyKey = propertyKeys[j];
        var property = element.getPropertyUnfiltered(propertyKey);

        if (excludedProperties.indexOf(propertyKey) === -1) {
          graphSONElement[propertyKey] = property;
        }
      }
    }
  };

}());