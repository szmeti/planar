/* global ElementRendererProvider: true */
var ElementRendererProvider = (function () {

  return {

    getVertexRenderer: function (vertex, engine) {
      var renderer;

      var vertexType = vertex.getProperty(PROP_TYPE);
      if (vertexType !== null) {
        renderer = utils.get(settings, engine, 'vertexRenderers', vertexType);
      }

      if (utils.isUndefined(renderer)) {
        renderer = utils.get(settings, engine, 'defaultVertexRenderer');
      }

      return renderer;
    }

  };

}());