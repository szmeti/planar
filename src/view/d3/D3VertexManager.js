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
      var zoom = this.zoom;
      var dragOffsetX;
      var dragOffsetY;

      drag.on('dragstart', function (uiVertex) {
        var scale = zoom.scale();
        var translate = zoom.translate();

        if (scale === 1) {
          translate = [0, 0];
        }

        var sourceEvent = d3.event.sourceEvent;
        var translatedMouseX = sourceEvent.offsetX - translate[0];
        var translatedMouseY = sourceEvent.offsetY - translate[1];
        dragOffsetX = translatedMouseX / scale - uiVertex.x;
        dragOffsetY = translatedMouseY / scale - uiVertex.y;

        dragStartTime = new Date().valueOf();

        sourceEvent.stopPropagation();
        var graph = uiVertex.vertex.getGraph();
        graph.trigger('vertexDragStart', uiVertex);
      });

      drag.on('drag', function (uiVertex) {
        var now = new Date().valueOf();
        if (now - dragStartTime > instanceSettings.drag.delay) {
          uiVertex.x = d3.event.x - dragOffsetX;
          uiVertex.y = d3.event.y - dragOffsetY;
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