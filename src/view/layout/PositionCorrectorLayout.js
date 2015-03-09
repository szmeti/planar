/* global PositionCorrectorLayout: true */
var PositionCorrectorLayout = (function () {

  function PositionCorrectorLayout(duration, easing) {
    this.running = true;
    this.tween = new Tween(duration, easing);
    this.name = 'positionCorrector';
  }

  var PADDING = 20;

  var calculateEndPoint = function (vertices, currentVertex, currentBeginX, currentBeginY, centerX, centerY, width, height) {
    currentVertex.endX = currentBeginX;
    currentVertex.endY = currentBeginY;
    var currentWidth = SvgUtils.widthOf(currentVertex);
    var currentHeight = SvgUtils.heightOf(currentVertex);

    for (var i = 0; i < vertices.length; i++) {
      var vertex = vertices[i];

      if (vertex.id === currentVertex.id) {
        continue;
      }

      var vertexWidth = SvgUtils.widthOf(vertex);
      var vertexHeight = SvgUtils.heightOf(vertex);
      var beginX = vertex.vertex.getPropertyUnfiltered('_beginX');
      var beginY = vertex.vertex.getPropertyUnfiltered('_beginY');

      moveVertex(currentVertex, vertex, currentBeginX, currentBeginY, currentWidth, currentHeight, beginX, beginY, vertexWidth, vertexHeight, centerX, centerY, width, height);

      currentBeginX = currentVertex.vertex.getPropertyUnfiltered('_beginX');
      currentBeginY = currentVertex.vertex.getPropertyUnfiltered('_beginY');
    }
  };

  var moveVertex = function (currentVertex, vertex, currentBeginX, currentBeginY, currentWidth, currentHeight, beginX, beginY, vertexWidth, vertexHeight, centerX, centerY, width, height) {
    var wrongX = currentBeginX + (currentWidth + PADDING) / 2 >= beginX - vertexWidth / 2 && currentBeginX - (currentWidth + PADDING) / 2 <= beginX + vertexWidth / 2;
    var wrongY = currentBeginY + (currentHeight + PADDING) / 2 >= beginY - vertexHeight / 2 && currentBeginY - (currentHeight + PADDING) / 2 <= beginY + vertexHeight / 2;

    var lessThanXThreshold = currentBeginX > PADDING + currentWidth && currentBeginX < width - PADDING - currentWidth;
    var lessThanYThreshold = currentBeginY > PADDING + currentHeight && currentBeginY < height - PADDING - currentHeight;

    if (wrongX && wrongY && lessThanXThreshold && lessThanYThreshold) {
      var x = currentBeginX - centerX > 0 ? currentBeginX + 1 : currentBeginX - 1;
      var y = ((currentBeginY - centerY) * (x - centerX)) / (currentBeginX - centerX) + centerY;

      currentVertex.endX = x;
      currentVertex.endY = y;
      currentVertex.vertex.setPropertyUnfiltered('_beginX', x);
      currentVertex.vertex.setPropertyUnfiltered('_beginY', y);

      moveVertex(currentVertex, vertex, x, y, currentWidth, currentHeight, beginX, beginY, vertexWidth, vertexHeight, centerX, centerY, width, height);
    }
  };

  utils.mixin(PositionCorrectorLayout.prototype, {

    step: function (vertices, edges, width, height) {

      var finishedVertices = vertices.length;

      var scale = 1;
      var centerX = width * (0.5 / scale);
      var centerY = height * (0.5 / scale);

      if (this.running) {

        finishedVertices = 0;

        for (var i = 0; i < vertices.length; i++) {
          var uiVertex = vertices[i];

          if (uiVertex.g === undefined) {
            return true;
          }

          if(uiVertex.started) {
            this.tween.runFrame(uiVertex, scale);
            if(uiVertex.finished) {
              finishedVertices++;
            }
          } else {
            var beginX = uiVertex.vertex.getPropertyUnfiltered('_beginX');
            var beginY = uiVertex.vertex.getPropertyUnfiltered('_beginY');
            PositionCorrectorLayout.setBeginPoint(uiVertex, beginX, beginY);

            calculateEndPoint(vertices, uiVertex, beginX, beginY, centerX, centerY, width, height);

            this.tween.start(uiVertex, scale);
          }
        }

      }

      if (this.running && finishedVertices === vertices.length && vertices.length > 0) {
        vertices[0].vertex.getGraph().trigger('graphUpdated');
      }

      this.running = finishedVertices < vertices.length;
      return this.running;
    }

  });

  PositionCorrectorLayout.setBeginPoint = function (uiVertex, beginX, beginY) {
    if(utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
      uiVertex.beginX = beginX;
      uiVertex.beginY = beginY;
      uiVertex.x = uiVertex.beginX;
      uiVertex.y = uiVertex.beginY;
    } else {
      uiVertex.beginX = uiVertex.x;
      uiVertex.beginY = uiVertex.y;
    }
  };

  return PositionCorrectorLayout;
}());