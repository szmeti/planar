/* global CircleLayout: true */
var CircleLayout = (function () {

  function CircleLayout() {
    this.running = true;
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

    step: function (vertices, edges, width, height, easing, duration) {
      var finishedVertices = vertices.length;

      if (this.running) {
        finishedVertices = 0;
        var tween = new Tween(duration, easing);

        var nn = vertices.length;
        var radius = calculateRadius(nn);
        var scale = calculateScale(radius, width, height);

        CircleLayout.setScale(scale);

        var cx = width * (0.5 / scale);
        var cy = height * (0.5 / scale);

        for (var i = 0; i < vertices.length; i++) {
          var vertex = vertices[i];
          if(vertex.started) {
            if(vertex.finished) {
              finishedVertices++;
              vertex.vertex.getGraph().trigger('graphUpdated');
            }
          } else {
            CircleLayout.setBeginPoint(vertex, width, height);

            vertex.x = vertex.beginX;
            vertex.y = vertex.beginY;

            var angle = (2*Math.PI*i) / nn;
            vertex.endX = Math.cos(angle)*radius + cx;
            vertex.endY = Math.sin(angle)*radius + cy;

            tween.start(vertex);
            vertex.started = true;
          }
        }
      }

      this.running = finishedVertices < vertices.length;
      return this.running;
    }

  });

  CircleLayout.setScale = function (scale) {
    d3.select('#graphElements').attr('transform', 'scale(' + scale + ')');
  };

  CircleLayout.setBeginPoint = function (vertex, width, height) {
    vertex.beginX = utils.randomInteger(0, width + 1);
    vertex.beginY = utils.randomInteger(0, height + 1);
  };

  return CircleLayout;
}());
