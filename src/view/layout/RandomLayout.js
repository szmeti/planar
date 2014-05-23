/* global RandomLayout: true */
var RandomLayout = (function () {

  function RandomLayout() {
  }

  utils.mixin(RandomLayout.prototype, {

    step: function (vertices, edges, width, height) {
      for (var i = 0; i < vertices.length; i++) {
        var vertex = vertices[i];
        vertex.x = utils.randomInteger(0, width + 1);
        vertex.y = utils.randomInteger(0, height + 1);
      }

      return true;
    }

  });

  return RandomLayout;

}());