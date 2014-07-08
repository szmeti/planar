/* global ElementRendererDecorator: true */
var ElementRendererDecorator = (function () {

  return {

    init: function (element, container) {
      if (this.elementRenderer.asynch === true) {
        this.elementRenderer.drawReadyCallback = this.doInit;
        this.elementRenderer.init(element, container);
      } else {
        this.elementRenderer.init(element, container);
        this.doInit(element, container);
      }

    },

    initDefs: function (defs) {
      this.elementRenderer.initDefs(defs);
      this.doInitDefs(defs);
    },

    updatePosition: function(uiEdge) {
      this.elementRenderer.updatePosition(uiEdge);
      this.doUpdatePosition(uiEdge);
    },

    doInit: function (element, container) {},

    doInitDefs: function (defs) {},

    doUpdatePosition: function(uiEdge) {}

  };

}());