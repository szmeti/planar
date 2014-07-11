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

  var _runFrame = function (vertex, easing, duration) {
    calculateState(vertex, duration);

    vertex.x = easing(vertex.currentTime, vertex.endX, vertex.beginX - vertex.endX, duration);
    vertex.y = easing(vertex.currentTime, vertex.endY, vertex.beginY - vertex.endY, duration);

    if (vertex.state === 0) {
      vertex.finished = true;
    } else {
      requestAnimationFrame(function () {_runFrame(vertex, easing, duration);});
    }

  };

  utils.mixin(Tween.prototype, {
    start: function (vertex) {
      var duration = this.duration;
      var easing = this.easing;
      vertex.state = 1;
      vertex.startTime = Tween.dateNow();
      vertex.endTime = vertex.startTime + duration;
      requestAnimationFrame(function () {_runFrame(vertex, easing, duration);});
    }
  });

  Tween.dateNow = function () {
    return new Date().getTime();
  };

  return Tween;
}());
