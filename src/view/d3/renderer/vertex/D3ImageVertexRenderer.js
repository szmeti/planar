/* global D3ImageVertexRenderer: true */
var D3ImageVertexRenderer = (function () {

  function D3ImageVertexRenderer() {
    this.asynch = true;
  }

  utils.mixin(D3ImageVertexRenderer.prototype, {

    init: function (uiVertex, element) {
      var vertex = uiVertex.vertex;
      uiVertex.uiElement = element;

      var instanceSettings = vertex.getGraph().getSettings();
      var imageUrl = vertex.getProperty(instanceSettings.vertex.imageUrlPropertyKey);

      var image = element
        .append('svg:image')
        .attr('xlink:href', imageUrl);

      var self = this;
      var img = new Image();
      img.src = imageUrl;
      img.onload = function () {
        var width = this.width;
        var height = this.height;

        image.attr('width', width)
          .attr('height', height)
          .attr('x', -width / 2)
          .attr('y', -height / 2);

        vertex.getGraph().trigger('graphUpdated');
        self.drawReadyCallback(uiVertex, element);
      };

    },

    initDefs: function (defs) {
    }

  });

  return D3ImageVertexRenderer;

}());