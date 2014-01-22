/* global RaphaelEngine: true */
var RaphaelEngine = (function () {

  function RaphaelEngine() {
  }

  utils.mixin(RaphaelEngine.prototype, {

    init: function (container, width, height) {
      utils.checkExists('Container', container);

      this.paper = new Raphael(container, width, height);
    },

    initVertex: function (vertex) {
      var renderer = ElementRendererProvider.getVertexRenderer(vertex, 'raphael');
      utils.checkExists('Renderer', renderer);
      renderer.init(vertex, this.paper);
    },

    renderVertex: function(vertex) {
      var renderer = ElementRendererProvider.getVertexRenderer(vertex, 'raphael');
      utils.checkExists('Renderer', renderer);
      renderer.render(vertex, this.paper);
    }

  });

  return RaphaelEngine;

}());