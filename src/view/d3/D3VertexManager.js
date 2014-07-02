/* global D3VertexManager: true */
var D3VertexManager = (function () {

  function D3VertexManager(element) {
    this.element = element;

  }

  utils.mixin(D3VertexManager.prototype, {
    addDragToVertices : function() {
      var drag = d3.behavior.drag();

      drag.on('dragstart', function (uiVertex) {
        d3.event.sourceEvent.stopPropagation();
        var graph = uiVertex.vertex.getGraph();
        graph.trigger('vertexDragStart', uiVertex);
      });

      drag.on('drag', function (uiVertex) {
        uiVertex.x = d3.event.x;
        uiVertex.y = d3.event.y;
        var graph = uiVertex.vertex.getGraph();
        graph.trigger('vertexDrag', uiVertex);
      });

      drag.on('dragend', function (uiVertex) {
        var graph = uiVertex.vertex.getGraph();
        graph.trigger('vertexDragEnd', uiVertex);
      });

      this.element.call(drag);
    }
  });


  return D3VertexManager;
})();