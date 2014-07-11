/* global Easing: true */
var Easing = {
  expoInOut: function (time, begin, change, duration) {
    if (time===0) {
      return begin;
    }
    if (time===duration) {
      return begin+change;
    }
    time = time/(duration/2);
    if (time < 1) {
      return change/2 * Math.pow(2, 10 * (time - 1)) + begin;
    }
    return change/2 * (-Math.pow(2, -10 * --time) + 2) + begin;
  }
};