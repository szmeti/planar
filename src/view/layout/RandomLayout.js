/* global RandomLayout: true */
var RandomLayout = (function () {

  var padding = 10;

  function RandomLayout(duration, easing) {
    this.running = true;
    this.tween = new Tween(duration, easing);
    this.name = 'random'
  }

  var calculateScale = function (width, height, numberOfVertices) {
    var areaRatio = (width * height) / (NODE_WIDTH * NODE_WIDTH * numberOfVertices);

    return areaRatio > 1 ? 1 : areaRatio;
  };

  utils.mixin(RandomLayout.prototype, {

    step: function (vertices, edges, width, height) {
      var finishedVertices = vertices.length;

      if (this.running) {
        finishedVertices = 0;

        var scale = calculateScale(width, height, vertices.length);
        var cx = width * (0.5 / scale);
        var cy = height * (0.5 / scale);

        for (var i = 0; i < vertices.length; i++) {
          var vertex = vertices[i];

          if (vertex.started) {
            this.tween.runFrame(vertex, scale);
            if (vertex.finished) {
              finishedVertices++;
            }
          } else {
            RandomLayout.setBeginPoint(vertex, cx, cy);
            vertex.endX = utils.randomInteger(0, width + 1);
            vertex.endX = Math.max(vertex.endX, NODE_WIDTH / 2 + padding);
            vertex.endX = Math.min(vertex.endX, width - NODE_WIDTH / 2 - padding);
            vertex.endY = utils.randomInteger(0, height + 1);
            vertex.endY = Math.max(vertex.endY, NODE_WIDTH / 2 + padding);
            vertex.endY = Math.min(vertex.endY, height - NODE_WIDTH / 2 - padding);
            this.tween.start(vertex, scale);
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

  RandomLayout.setBeginPoint = function (uiVertex, cx, cy) {
    if (utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
      uiVertex.beginX = cx;
      uiVertex.beginY = cy;
      uiVertex.x = cx;
      uiVertex.y = cy;
    } else {
      uiVertex.beginX = uiVertex.x;
      uiVertex.beginY = uiVertex.y;
    }
  };

  return RandomLayout;

}());