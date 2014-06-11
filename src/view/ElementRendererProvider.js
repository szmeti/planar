/* global ElementRendererProvider: true */
var ElementRendererProvider = (function () {

  return {

    getRenderer: function (element, engine, type) {
      var renderer;

      var elementType = element.getPropertyUnfiltered(PROP_TYPE);
      if (elementType !== null) {
        renderer = utils.get(settings, engine, type === 'vertex' ? 'vertexRenderers' : 'edgeRenderers', elementType);
      }

      if (utils.isUndefined(renderer)) {
        renderer = utils.get(settings, engine, type === 'vertex' ? 'defaultVertexRenderer' : 'defaultEdgeRenderer');
      }

      return renderer;
    },

    getAll: function(engine) {
      var engineSetting = utils.get(settings, engine);
      var renderers = utils.values(engineSetting.vertexRenderers);
      renderers = renderers.concat(utils.values(engineSetting.edgeRenderers));

      return renderers;
    },

    getVertexRenderer: function (vertex, engine) {
      return this.getRenderer(vertex, engine, 'vertex');
    },

    getEdgeRenderer: function (edge, engine) {
      return this.getRenderer(edge, engine, 'edge');

    }

  };

}());