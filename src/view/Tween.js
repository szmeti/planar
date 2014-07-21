/* global Tween: true */
var Tween = (function () {

  function Tween(duration, easing) {
    this.duration = duration;
    this.easing = easing;
  }

  var calculateState = function (vertex, duration) {
    var now = Tween.dateNow();
    vertex.currentTime = vertex.endTime - now;
    vertex.state = vertex.currentTime / duration;
    if (vertex.state < 0) {
      vertex.state = 0;
    }
  };

  utils.mixin(Tween.prototype, {
    start: function (vertex, scale) {
      vertex.state = 1;
      vertex.startTime = Tween.dateNow();
      vertex.endTime = vertex.startTime + this.duration;
      vertex.started = true;
      this.runFrame(vertex, scale);
    },
    runFrame: function (vertex, scale) {
      calculateState(vertex, this.duration);

      vertex.x = this.easing(vertex.currentTime, vertex.endX, vertex.beginX - vertex.endX, this.duration);
      vertex.y = this.easing(vertex.currentTime, vertex.endY, vertex.beginY - vertex.endY, this.duration);

      LayoutUtils.setScale(this.easing(vertex.currentTime, scale, LayoutUtils.getScale() - scale, this.duration));

      if (vertex.state === 0) {
        vertex.finished = true;
      }

    }
  });

  Tween.dateNow = function () {
    return new Date().getTime();
  };

  return Tween;
}());
