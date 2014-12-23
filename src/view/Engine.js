/* global Engine: true */
var Engine = (function () {

  return {

    init: function (settings, graph) {
      utils.checkExists('Container', settings.container);
      utils.checkExists('Graph', graph);

      if (utils.isFunction(this.initEngine)) {
        this.initEngine(settings, graph);
      }
    },

    beforeRender: function () {
    },

    initVertex: function () {
    },

    renderVertex: function () {
    },

    stop: function () {
    },

    moveVertexToFront: function () {
    },

    vertexPropertyUpdated: function () {

    },

    edgePropertyUpdated: function () {

    },

    vertexPropertyRemoved: function () {

    },

    edgePropertyRemoved: function () {

    }

  };

}());