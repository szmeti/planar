/* global LegacyGraphSONWriter: true */
var LegacyGraphSONWriter = (function () {
  function LegacyGraphSONWriter() {
  }

  utils.mixin(LegacyGraphSONWriter.prototype, GraphSONWriterBase);
  utils.mixin(LegacyGraphSONWriter.prototype, {
    getTemplate: function (mode) {
      return {
        mode: mode,
        vertices: [],
        edges: []
      };
    },

    writeVertex: function (sourceVertex, graphSONVertex, excludedVertexProperties) {
      graphSONVertex[ID] = sourceVertex.id;
      this.copyProperties(sourceVertex, graphSONVertex, excludedVertexProperties);
    },

    writeEdge: function (sourceEdge, graphSONEdge, excludedVertexProperties, excludedEdgeProperties) {
      graphSONEdge[ID] = sourceEdge.id;
      graphSONEdge[LABEL] = sourceEdge.label;
      graphSONEdge[IN_V] = sourceEdge.getVertex(IN).id;
      graphSONEdge[OUT_V] = sourceEdge.getVertex(OUT).id;
      this.copyProperties(sourceEdge, graphSONEdge, excludedEdgeProperties);
    }
  });

  return LegacyGraphSONWriter;
}());