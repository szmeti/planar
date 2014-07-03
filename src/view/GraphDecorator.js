/* global GraphDecorator: true */
var GraphDecorator = (function () {

  return {

    init: function (element, container) {
      if (this.renderer.asynch === true) {
        this.renderer.drawReadyCallback = this.doInit;
        this.renderer.init(element, container);
      } else {
        this.renderer.init(element, container);
        this.doInit(element, container);
      }

    },

    initDefs: function (defs) {
      this.renderer.initDefs(defs);
      this.doInitDefs(defs);
    },

    updatePosition: function(uiEdge) {
      this.renderer.updatePosition(uiEdge);
      this.doUpdatePosition(uiEdge);
    },

    doInit: function (element, container) {},

    doInitDefs: function (defs) {},

    doUpdatePosition: function(uiEdge) {}

  };

}());