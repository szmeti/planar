/* global TossToBorderLayout: true */
var TossToBorderLayout = (function () {

  function TossToBorderLayout(duration, easing) {
    this.running = true;
    this.tween = new Tween(duration, easing);
    this.name = 'tossToBorder';
    this.started = false;
  }

  var PADDING_FROM_BORDER = 20;
  var PADDING_BETWEEN_VERTICES = 70;

  var calculateEndPoint = function (vertices, currentUiVertex, currentUiVertexDrawingData, drawingArea, pointsOnLine) {
    var overlapArea = 0;

    for (var i = 0; i < vertices.length; i++) {
      var uiVertex = vertices[i];

      if (uiVertex.id === currentUiVertex.id) {
        continue;
      }

      var uiVertexDrawingData = {
        width: uiVertex.originalWidth,
        height: uiVertex.originalHeight,
        beginX: uiVertex.vertex.getPropertyUnfiltered('_beginX'),
        beginY: uiVertex.vertex.getPropertyUnfiltered('_beginY')
      };

      overlapArea += calculateOverlapArea(currentUiVertexDrawingData, uiVertexDrawingData);
    }
    pointsOnLine[overlapArea] = {
      x: currentUiVertexDrawingData.beginX,
      y: currentUiVertexDrawingData.beginY
    };

    var xInsideDrawingArea = currentUiVertexDrawingData.beginX > PADDING_FROM_BORDER + currentUiVertexDrawingData.width / 2 &&
      currentUiVertexDrawingData.beginX < drawingArea.width - PADDING_FROM_BORDER - currentUiVertexDrawingData.width / 2;

    var yInsideDrawingArea = currentUiVertexDrawingData.beginY > PADDING_FROM_BORDER + currentUiVertexDrawingData.height / 2 &&
      currentUiVertexDrawingData.beginY < drawingArea.height - PADDING_FROM_BORDER - currentUiVertexDrawingData.height / 2;

    var hasPointChangedInLastRecursion = currentUiVertex.previousBeginX != currentUiVertex.vertex.getPropertyUnfiltered('_beginX') &&
      currentUiVertex.previousBeginY != currentUiVertex.vertex.getPropertyUnfiltered('_beginY');

    if (overlapArea > 0 && xInsideDrawingArea && yInsideDrawingArea && hasPointChangedInLastRecursion) {
      currentUiVertex.previousBeginX = currentUiVertex.vertex.getPropertyUnfiltered('_beginX');
      currentUiVertex.previousBeginY = currentUiVertex.vertex.getPropertyUnfiltered('_beginY');
      moveVertex(currentUiVertex, currentUiVertexDrawingData, drawingArea);
      currentUiVertexDrawingData.beginX = currentUiVertex.vertex.getPropertyUnfiltered('_beginX');
      currentUiVertexDrawingData.beginY = currentUiVertex.vertex.getPropertyUnfiltered('_beginY');
      calculateEndPoint(vertices, currentUiVertex, currentUiVertexDrawingData, drawingArea, pointsOnLine);
    }

    return pointsOnLine;
  };

  var moveVertex = function (currentUiVertex, currentUiVertexDrawingData, drawingArea) {
    var xDistanceFromCenter = currentUiVertexDrawingData.beginX - drawingArea.centerX;
    var x = xDistanceFromCenter > 0 ? currentUiVertexDrawingData.beginX + 1 : currentUiVertexDrawingData.beginX - 1;

    var yDistanceFromCenter = currentUiVertexDrawingData.beginY - drawingArea.centerY;
    var y = 0;
    if (yDistanceFromCenter === 0 && xDistanceFromCenter === 0) {
      //already in center keep it there
      return;
    } else if (xDistanceFromCenter === 0) {
      //x point is already in center so move on y-axis
      y = yDistanceFromCenter > 0 ? currentUiVertexDrawingData.beginY + 1 : currentUiVertexDrawingData.beginY - 1;
    } else {
      //move and keep the ratio from the center
      y = yDistanceFromCenter * (x - drawingArea.centerX) / xDistanceFromCenter + drawingArea.centerY;
    }

    currentUiVertex.vertex.setPropertyUnfiltered("_beginX", x);
    currentUiVertex.vertex.setPropertyUnfiltered("_beginY", y);
  };

  var calculateOverlapArea = function (currentUiVertexDrawingData, uiVertexDrawingData) {
    var x11 = currentUiVertexDrawingData.beginX - (currentUiVertexDrawingData.width / 2) - PADDING_BETWEEN_VERTICES;
    var y11 = currentUiVertexDrawingData.beginY - (currentUiVertexDrawingData.height / 2) - PADDING_BETWEEN_VERTICES;
    var x12 = currentUiVertexDrawingData.beginX + (currentUiVertexDrawingData.width / 2) + PADDING_BETWEEN_VERTICES;
    var y12 = currentUiVertexDrawingData.beginY + (currentUiVertexDrawingData.height / 2) + PADDING_BETWEEN_VERTICES;

    var x21 = uiVertexDrawingData.beginX - (uiVertexDrawingData.width / 2);
    var y21 = uiVertexDrawingData.beginY - (uiVertexDrawingData.height / 2);
    var x22 = uiVertexDrawingData.beginX + (uiVertexDrawingData.width / 2);
    var y22 = uiVertexDrawingData.beginY + (uiVertexDrawingData.height / 2);

    var xOverlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
    var yOverlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));

    return xOverlap * yOverlap;
  };

  var calculateCenterOfGraph = function (vertices) {
    var centerOfGraph = {x: 0, y: 0};
    for (var i = 0; i < vertices.length; i++) {
      var uiVertex = vertices[i];
      centerOfGraph.x += uiVertex.vertex.getPropertyUnfiltered('_beginX');
      centerOfGraph.y += uiVertex.vertex.getPropertyUnfiltered('_beginY');
    }

    centerOfGraph.x = centerOfGraph.x / vertices.length;
    centerOfGraph.y = centerOfGraph.y / vertices.length;
    return centerOfGraph;
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

        if (!this.started) {
          var centerOfGraph = calculateCenterOfGraph(vertices);

          for (var i = 0; i < vertices.length; i++) {
            var uiVertex = vertices[i];

            if (uiVertex.g === undefined || SvgUtils.widthOf(uiVertex) === 0) {
              return true;
            }

            uiVertex.originalWidth = SvgUtils.widthOf(uiVertex);
            uiVertex.originalHeight = SvgUtils.heightOf(uiVertex);
            uiVertex.vertex.setPropertyUnfiltered("_beginX", uiVertex.vertex.getPropertyUnfiltered("_beginX") + (drawingArea.centerX - centerOfGraph.x));
            uiVertex.vertex.setPropertyUnfiltered("_beginY", uiVertex.vertex.getPropertyUnfiltered("_beginY") + (drawingArea.centerY - centerOfGraph.y));
          }

          for (i = 0; i < vertices.length; i++) {
            uiVertex = vertices[i];
            var uiVertexDrawingData = {
              beginX: uiVertex.vertex.getPropertyUnfiltered("_beginX"),
              beginY: uiVertex.vertex.getPropertyUnfiltered("_beginY"),
              width: uiVertex.originalWidth,
              height: uiVertex.originalHeight
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

          this.started = true;
        }

        finishedVertices = 0;
        for (i = 0; i < vertices.length; i++) {
          uiVertex = vertices[i];

          if (uiVertex.started) {
            this.tween.runFrame(uiVertex, scale);
            if (uiVertex.finished) {
              finishedVertices++;
            }
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