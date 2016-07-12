/* global GraphSONWriter: true */
var GraphSONWriter = (function () {
  function GraphSONWriter() {
    this.generateId = (function () {
      var id = 0;
      return function () {
        return id++;
      };
    })();
  }

  function copyEdges(writer, sourceVertex, direction, oppositeDirection, graphSONVertex, edgesKey, otherVertexKey, excludedProperties) {
    var edges = sourceVertex.getEdges(direction);

    if (edges.length > 0) {
      graphSONVertex[edgesKey] = {};
    }

    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      var label = edge.getLabel();

      graphSONVertex[edgesKey][label] = graphSONVertex[edgesKey][label] || [];

      var graphSONEdge = {};
      graphSONEdge.id = edge.getId();
      graphSONEdge[otherVertexKey] = edge.getVertex(oppositeDirection).getId();
      graphSONEdge.properties = {};
      writer.copyProperties(edge, graphSONEdge.properties, excludedProperties);

      graphSONVertex[edgesKey][label].push(graphSONEdge);
    }
  }

  function copyVertexProperties(writer, sourceVertex, graphSONVertex, excludedVertexProperties) {
    graphSONVertex.properties = {};

    var propertyKeys = sourceVertex.getPropertyKeys();

    for (var j = 0; j < propertyKeys.length; j++) {
      var propertyKey = propertyKeys[j];

      if (excludedVertexProperties.indexOf(propertyKey) === -1) {
        var property = sourceVertex.getPropertyUnfiltered(propertyKey);

        graphSONVertex.properties[propertyKey] = graphSONVertex.properties[propertyKey] || [];
        var graphSONProperty = {id: writer.generateId(), value: property};
        graphSONVertex.properties[propertyKey].push(graphSONProperty);
      }
    }
  }

  utils.mixin(GraphSONWriter.prototype, GraphSONWriterBase);
  utils.mixin(GraphSONWriter.prototype, {
    getTemplate: function () {
      return {
        vertices: []
      };
    },

    writeVertex: function (sourceVertex, graphSONVertex, excludedVertexProperties, excludedEdgeProperties) {
      graphSONVertex.id = sourceVertex.getId();
      graphSONVertex.label = 'vertex';
      copyEdges(this, sourceVertex, IN, OUT, graphSONVertex, 'inE', 'outV', excludedEdgeProperties);
      copyEdges(this, sourceVertex, OUT, IN, graphSONVertex, 'outE', 'inV', excludedEdgeProperties);
      copyVertexProperties(this, sourceVertex, graphSONVertex, excludedVertexProperties);
    },

    writeEdge: function (sourceEdge, graphSONEdge, excludedVertexProperties, excludedEdgeProperties) {

    }
  });

  return GraphSONWriter;
}());