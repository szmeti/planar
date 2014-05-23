/* global Engine: true */
var Engine = (function () {

  return {

    init: function (container, width, height, graph) {
      utils.checkExists('Container', container);
      utils.checkExists('Graph', graph);

      if (utils.isFunction(this.initEngine)) {
        this.initEngine(container, width, height, graph);
      }
    },

    beforeRender: function () {
    },

    initVertex: function () {
    },

    renderVertex: function () {
    }

  };

}());