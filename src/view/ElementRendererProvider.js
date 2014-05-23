/* global ElementRendererProvider: true */
var ElementRendererProvider = (function () {

  return {

    getRenderer: function (element, engine, type) {
      var renderer;

      var elementType = element.getProperty(PROP_TYPE);
      if (elementType !== null) {
        renderer = utils.get(settings, engine, type === 'vertex' ? 'vertexRenderers' : 'edgeRenderers', elementType);
      }

      if (utils.isUndefined(renderer)) {
        renderer = utils.get(settings, engine, type === 'vertex' ? 'defaultVertexRenderer' : 'defaultEdgeRenderer');
      }

      return renderer;
    },

    getVertexRenderer: function (vertex, engine) {
      return this.getRenderer(vertex, engine, 'vertex');
    },

    getEdgeRenderer: function (edge, engine) {
      return this.getRenderer(edge, engine, 'edge');

    }

  };

}());