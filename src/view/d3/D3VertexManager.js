/* global D3VertexManager: true */
var D3VertexManager = (function () {

  function D3VertexManager(element, instanceSettings) {
    this.element = element;
    this.instanceSettings = instanceSettings;
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
          var vertexBoundingBox = uiVertex.g[0][0].getBBox();

          var oldLeftCorner = {
            x: uiVertex.x + vertexBoundingBox.x,
            y: uiVertex.y + vertexBoundingBox.y
          };

          var topEdgeIntersectionPoint = {
            x: uiVertex.x,
            y: uiVertex.y + vertexBoundingBox.y
          };

          var distanceFromLeftToMiddle = GeometryUtils.distanceOfPoints(oldLeftCorner, topEdgeIntersectionPoint);
          var distanceFromRightToMiddle = vertexBoundingBox.width - distanceFromLeftToMiddle;
          var distanceFromTopToMiddle = GeometryUtils.distanceOfPoints(uiVertex, topEdgeIntersectionPoint);
          var distanceFromBottomToMiddle = vertexBoundingBox.height - distanceFromTopToMiddle;

          var leftCorner = {
            x: d3.event.x + vertexBoundingBox.x,
            y: d3.event.y + vertexBoundingBox.y
          };

          var rightCorner = {
            x: leftCorner.x + vertexBoundingBox.width,
            y: leftCorner.y + vertexBoundingBox.height
          };

          if (leftCorner.x <= 0) {
            uiVertex.x = distanceFromLeftToMiddle;
          } else if (rightCorner.x >= instanceSettings.width) {
            uiVertex.x = instanceSettings.width - distanceFromRightToMiddle;
          } else {
            uiVertex.x = d3.event.x;
          }

          if (leftCorner.y <= 0) {
            uiVertex.y = distanceFromTopToMiddle;
          } else if (rightCorner.y >= instanceSettings.height) {
            uiVertex.y = instanceSettings.height - distanceFromBottomToMiddle;
          } else {
            uiVertex.y = d3.event.y;
          }

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