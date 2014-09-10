/* global D3VertexManager: true */
var D3VertexManager = (function () {

  function D3VertexManager(element, instanceSettings, zoom) {
    this.element = element;
    this.instanceSettings = instanceSettings;
    this.zoom = zoom;
  }

  utils.mixin(D3VertexManager.prototype, {
    addDragToVertices: function () {
      var drag = d3.behavior.drag();
      var dragStartTime;
      var instanceSettings = this.instanceSettings;

      drag.origin(function (uiVertex) {
        return uiVertex;
      });

      drag.on('dragstart', function (uiVertex) {
        dragStartTime = new Date().valueOf();

        d3.event.sourceEvent.stopPropagation();
        var graph = uiVertex.vertex.getGraph();
        graph.trigger('vertexDragStart', uiVertex);
      });

      drag.on('drag', function (uiVertex) {
        var now = new Date().valueOf();
        if (now - dragStartTime > instanceSettings.drag.delay) {
          uiVertex.x = d3.event.x;
          uiVertex.y = d3.event.y;
          var graph = uiVertex.vertex.getGraph();
          graph.trigger('vertexDrag', uiVertex);
        }
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