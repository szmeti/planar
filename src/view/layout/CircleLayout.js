/* global CircleLayout: true */
var CircleLayout = (function () {

  function CircleLayout(duration, easing, ignoreVertex) {
    this.running = true;
    this.tween = new Tween(duration, easing);
    this.ignoreVertex = ignoreVertex;
  }

  CircleLayout.MIN_RADIUS = 100;

  var calculateRadius = function (vertexCount) {
    var radius = vertexCount * 19;
    return radius < CircleLayout.MIN_RADIUS ? CircleLayout.MIN_RADIUS : radius;
  };

  var calculateScale = function (radius, width, height) {
    var maxRadius = width < height ? width / 2 : height / 2;
    var scale = maxRadius / (radius + 75);
    return  scale > 1 ? 1 : scale;
  };

  utils.mixin(CircleLayout.prototype, {

    step: function (vertices, edges, width, height, ignoredVertex) {
      var finishedVertices = vertices.length;

      if (this.running) {
        finishedVertices = 0;

        if (utils.isUndefined(this.ignoreVertex) || !this.ignoreVertex) {
          ignoredVertex = undefined;
        }

        var numberOfVertices = utils.isUndefined(ignoredVertex) ? vertices.length : vertices.length - 1;
        var radius = calculateRadius(numberOfVertices);
        var scale = calculateScale(radius, width, height);

        var cx = width * (0.5 / scale);
        var cy = height * (0.5 / scale);

        var indexOnCircle = 0;
        for (var i = 0; i < vertices.length; i++) {
          var uiVertex = vertices[i];
          if(uiVertex.started) {
            this.tween.runFrame(uiVertex, scale);
            if(uiVertex.finished) {
              finishedVertices++;
            }
          } else {
            CircleLayout.setBeginPoint(uiVertex, cx, cy);
            if (!utils.isUndefined(ignoredVertex) && ignoredVertex.id === uiVertex.id) {
              uiVertex.endX = cx;
              uiVertex.endY = cy;
            } else {
              var angle = (2*Math.PI*indexOnCircle++) / numberOfVertices;
              uiVertex.endX = Math.cos(angle)*radius + cx;
              uiVertex.endY = Math.sin(angle)*radius + cy;
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

  CircleLayout.setBeginPoint = function (uiVertex, cx, cy) {
    if(utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
      uiVertex.beginX = cx;
      uiVertex.beginY = cy;
      uiVertex.x = uiVertex.beginX;
      uiVertex.y = uiVertex.beginY;
    } else {
      uiVertex.beginX = uiVertex.x;
      uiVertex.beginY = uiVertex.y;
    }
  };

  return CircleLayout;
}());
