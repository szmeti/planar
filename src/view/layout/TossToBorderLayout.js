/* global TossToBorderLayout: true */
var TossToBorderLayout = (function () {

  function TossToBorderLayout(duration, easing) {
    this.running = true;
    this.tween = new Tween(duration, easing);
    this.name = 'tossToBorder';
  }

  var PADDING = 20;

  var calculateEndPoint = function (vertices, currentUiVertex, currentUiVertexDrawingData, drawingArea, pointsOnLine) {
    var overlapArea = 0;

    for (var i = 0; i < vertices.length; i++) {
      var uiVertex = vertices[i];

      if (uiVertex.id === currentUiVertex.id) {
        continue;
      }

      var uiVertexDrawingData = {
        width: SvgUtils.widthOf(uiVertex),
        height: SvgUtils.heightOf(uiVertex),
        beginX: uiVertex.vertex.getPropertyUnfiltered('_beginX'),
        beginY: uiVertex.vertex.getPropertyUnfiltered('_beginY')
      };

      overlapArea += calculateOverlapArea(currentUiVertexDrawingData, uiVertexDrawingData);
    }
    pointsOnLine[overlapArea] = {
      x: currentUiVertexDrawingData.beginX,
      y: currentUiVertexDrawingData.beginY
    };

    var xInsideDrawingArea = currentUiVertexDrawingData.beginX > PADDING + currentUiVertexDrawingData.width / 2 &&
      currentUiVertexDrawingData.beginX < drawingArea.width - PADDING - currentUiVertexDrawingData.width / 2;

    var yInsideDrawingArea = currentUiVertexDrawingData.beginY > PADDING + currentUiVertexDrawingData.height / 2 &&
      currentUiVertexDrawingData.beginY < drawingArea.height - PADDING - currentUiVertexDrawingData.height / 2;

    if (overlapArea > 0 && xInsideDrawingArea && yInsideDrawingArea) {
      moveVertex(currentUiVertex, currentUiVertexDrawingData, drawingArea);
      currentUiVertexDrawingData.beginX = currentUiVertex.vertex.getPropertyUnfiltered('_beginX');
      currentUiVertexDrawingData.beginY = currentUiVertex.vertex.getPropertyUnfiltered('_beginY');
      calculateEndPoint(vertices, currentUiVertex, currentUiVertexDrawingData, drawingArea, pointsOnLine);
    }

    return pointsOnLine;
  };

  var moveVertex = function (currentUiVertex, currentUiVertexDrawingData, drawingArea) {
    var x = currentUiVertexDrawingData.beginX - drawingArea.centerX > 0 ? currentUiVertexDrawingData.beginX + 1 : currentUiVertexDrawingData.beginX - 1;
    // based on two-point form equation of a line
    var y = ((currentUiVertexDrawingData.beginY - drawingArea.centerY) * (x - drawingArea.centerX)) / (currentUiVertexDrawingData.beginX - drawingArea.centerX) + drawingArea.centerY;

    currentUiVertex.vertex.setPropertyUnfiltered('_beginX', x);
    currentUiVertex.vertex.setPropertyUnfiltered('_beginY', y);
  };

  var calculateOverlapArea = function (currentUiVertexDrawingData, uiVertexDrawingData) {
    var x11 = currentUiVertexDrawingData.beginX - (currentUiVertexDrawingData.width / 2) - PADDING;
    var y11 = currentUiVertexDrawingData.beginY - (currentUiVertexDrawingData.height / 2) - PADDING;
    var x12 = currentUiVertexDrawingData.beginX + (currentUiVertexDrawingData.width / 2) + PADDING;
    var y12 = currentUiVertexDrawingData.beginY + (currentUiVertexDrawingData.height / 2) + PADDING;

    var x21 = uiVertexDrawingData.beginX - (uiVertexDrawingData.width / 2);
    var y21 = uiVertexDrawingData.beginY - (uiVertexDrawingData.height / 2);
    var x22 = uiVertexDrawingData.beginX + (uiVertexDrawingData.width / 2);
    var y22 = uiVertexDrawingData.beginY + (uiVertexDrawingData.height / 2);

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
            var uiVertexDrawingData = {
              beginX: uiVertex.vertex.getPropertyUnfiltered('_beginX'),
              beginY: uiVertex.vertex.getPropertyUnfiltered('_beginY'),
              width: SvgUtils.widthOf(uiVertex),
              height: SvgUtils.heightOf(uiVertex)
            };
            TossToBorderLayout.setBeginPoint(uiVertex, uiVertexDrawingData);

            uiVertex.endX = uiVertexDrawingData.beginX;
            uiVertex.endY = uiVertexDrawingData.beginY;

            var pointsOnLine = calculateEndPoint(vertices, uiVertex, uiVertexDrawingData, drawingArea, {});

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

  TossToBorderLayout.setBeginPoint = function (uiVertex, uiVertexDrawingData) {
    if (utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
      uiVertex.beginX = uiVertexDrawingData.beginX;
      uiVertex.beginY = uiVertexDrawingData.beginY;
      uiVertex.x = uiVertex.beginX;
      uiVertex.y = uiVertex.beginY;
    } else {
      uiVertex.beginX = uiVertex.x;
      uiVertex.beginY = uiVertex.y;
    }
  };

  return TossToBorderLayout;
}());