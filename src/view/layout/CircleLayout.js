/* global CircleLayout: true */
var CircleLayout = (function () {

  function CircleLayout(duration, easing) {
    this.running = true;
    this.tween = new Tween(duration, easing);
  }

  var calculateRadius = function (vertexCount) {
    return vertexCount * 19;
  };

  var calculateScale = function (radius, width, height) {
    var maxRadius = width < height ? width / 2 : height / 2;
    var scale = maxRadius / (radius + 75);
    return  scale > 1 ? 1 : scale;
  };

  utils.mixin(CircleLayout.prototype, {

    step: function (vertices, edges, width, height) {
      var finishedVertices = vertices.length;

      if (this.running) {
        finishedVertices = 0;

        var numberOfVertices = vertices.length;
        var radius = calculateRadius(numberOfVertices);
        var scale = calculateScale(radius, width, height);

        LayoutUtils.setScale(scale);

        var cx = width * (0.5 / scale);
        var cy = height * (0.5 / scale);

        for (var i = 0; i < vertices.length; i++) {
          var uiVertex = vertices[i];
          if(uiVertex.started) {
            this.tween._runFrame(uiVertex);
            if(uiVertex.finished) {
              finishedVertices++;
            }
          } else {
            CircleLayout.setBeginPoint(uiVertex, cx, cy);

            var angle = (2*Math.PI*i) / numberOfVertices;
            uiVertex.endX = Math.cos(angle)*radius + cx;
            uiVertex.endY = Math.sin(angle)*radius + cy;

            this.tween.start(uiVertex);
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
