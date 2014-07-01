/* global Engine: true */
var Engine = (function () {

  return {

    init: function (container, navigatorContainer, width, height, graph) {
      utils.checkExists('Container', container);
      utils.checkExists('Graph', graph);

      if (utils.isFunction(this.initEngine)) {
        this.initEngine(container, navigatorContainer, width, height, graph);
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