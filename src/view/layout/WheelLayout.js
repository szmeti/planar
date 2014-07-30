/* global WheelLayout: true */
var WheelLayout = (function () {

  function WheelLayout(duration, easing) {
    this.running = true;
    this.circleLayout = new CircleLayout(duration, easing, true);
  }

  utils.mixin(WheelLayout.prototype, {

    step: function (vertices, edges, width, height, selectedVertex) {
      if(this.running) {
        var centerVertex = selectedVertex;

        if (vertices.length > 0 && utils.isUndefined(selectedVertex)) {
          centerVertex = vertices[0];
        }

        this.running = this.circleLayout.step(vertices, edges, width, height, centerVertex);
      }
      return this.running;
    }

  });

  return WheelLayout;
}());