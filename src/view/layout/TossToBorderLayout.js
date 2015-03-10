/* global TossToBorderLayout: true */
var TossToBorderLayout = (function () {

  function TossToBorderLayout(duration, easing) {
    this.running = true;
    this.tween = new Tween(duration, easing);
    this.name = 'tossToBorder';
  }

  var PADDING = 20;

  var calculateEndPoint = function (vertices, currentUiVertex, currentBeginX, currentBeginY, currentWidth, currentHeight, drawingArea, pointsOnLine) {
    var overlapArea = 0;

    for (var i = 0; i < vertices.length; i++) {
      var uiVertex = vertices[i];

      if (uiVertex.id === currentUiVertex.id) {
        continue;
      }
      var vertexWidth = SvgUtils.widthOf(uiVertex);
      var vertexHeight = SvgUtils.heightOf(uiVertex);
      var beginX = uiVertex.vertex.getPropertyUnfiltered('_beginX');
      var beginY = uiVertex.vertex.getPropertyUnfiltered('_beginY');

      overlapArea += calculateOverlapArea(currentBeginX, currentBeginY, currentWidth, currentHeight, beginX, beginY, vertexWidth, vertexHeight);
    }
    pointsOnLine[overlapArea] = {x: currentBeginX, y: currentBeginY};

    var xInsideDrawingArea = currentBeginX > PADDING + currentWidth / 2 && currentBeginX < drawingArea.width - PADDING - currentWidth / 2;
    var yInsideDrawingArea = currentBeginY > PADDING + currentHeight / 2 && currentBeginY < drawingArea.height - PADDING - currentHeight / 2;

    if (overlapArea > 0 && xInsideDrawingArea && yInsideDrawingArea) {
      moveVertex(currentUiVertex, currentBeginX, currentBeginY, currentWidth, currentHeight, drawingArea);
      calculateEndPoint(vertices, currentUiVertex, currentUiVertex.vertex.getPropertyUnfiltered('_beginX'), currentUiVertex.vertex.getPropertyUnfiltered('_beginY'), currentWidth, currentHeight, drawingArea, pointsOnLine);
    }

    return pointsOnLine;
  };

  var moveVertex = function (currentUiVertex, currentBeginX, currentBeginY, currentWidth, currentHeight, drawingArea) {
    var x = currentBeginX - drawingArea.centerX > 0 ? currentBeginX + 1 : currentBeginX - 1;
    // based on two-point form equation of a line
    var y = ((currentBeginY - drawingArea.centerY) * (x - drawingArea.centerX)) / (currentBeginX - drawingArea.centerX) + drawingArea.centerY;

    currentUiVertex.vertex.setPropertyUnfiltered('_beginX', x);
    currentUiVertex.vertex.setPropertyUnfiltered('_beginY', y);
  };

  var calculateOverlapArea = function (currentBeginX, currentBeginY, currentWidth, currentHeight, beginX, beginY, vertexWidth, vertexHeight) {
    var x11 = currentBeginX - (currentWidth / 2) - PADDING;
    var y11 = currentBeginY - (currentHeight / 2) - PADDING;
    var x12 = currentBeginX + (currentWidth / 2) + PADDING;
    var y12 = currentBeginY + (currentHeight / 2) + PADDING;

    var x21 = beginX - (vertexWidth / 2);
    var y21 = beginY - (vertexHeight / 2);
    var x22 = beginX + (vertexWidth / 2);
    var y22 = beginY + (vertexHeight / 2);

    var xOverlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
    var yOverlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));

    return xOverlap * yOverlap;
  };

  utils.mixin(TossToBorderLayout.prototype, {

    step: function (vertices, edges, width, height) {

      var finishedVertices = vertices.length;

      var scale = 1;
      var drawingArea = {
        centerX: width * (0.5 / scale),
        centerY: height * (0.5 / scale),
        width: width,
        height: height
      };

      if (this.running) {

        finishedVertices = 0;

        for (var i = 0; i < vertices.length; i++) {
          var uiVertex = vertices[i];

          if (uiVertex.g === undefined) {
            return true;
          }

          if (uiVertex.started) {
            this.tween.runFrame(uiVertex, scale);
            if (uiVertex.finished) {
              finishedVertices++;
            }
          } else {
            var beginX = uiVertex.vertex.getPropertyUnfiltered('_beginX');
            var beginY = uiVertex.vertex.getPropertyUnfiltered('_beginY');
            TossToBorderLayout.setBeginPoint(uiVertex, beginX, beginY);

            uiVertex.endX = beginX;
            uiVertex.endY = beginY;
            var currentWidth = SvgUtils.widthOf(uiVertex);
            var currentHeight = SvgUtils.heightOf(uiVertex);

            var pointsOnLine = calculateEndPoint(vertices, uiVertex, beginX, beginY, currentWidth, currentHeight, drawingArea, {});

            var minimumOverlap = null;

            for (var overlap in pointsOnLine) {
              if (minimumOverlap === null || overlap < minimumOverlap) {
                minimumOverlap = overlap;
                uiVertex.endX = pointsOnLine[minimumOverlap].x;
                uiVertex.endY = pointsOnLine[minimumOverlap].y;
              }
            }

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

  TossToBorderLayout.setBeginPoint = function (uiVertex, beginX, beginY) {
    if (utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
      uiVertex.beginX = beginX;
      uiVertex.beginY = beginY;
      uiVertex.x = uiVertex.beginX;
      uiVertex.y = uiVertex.beginY;
    } else {
      uiVertex.beginX = uiVertex.x;
      uiVertex.beginY = uiVertex.y;
    }
  };

  return TossToBorderLayout;
}());