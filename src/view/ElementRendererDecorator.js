/* global ElementRendererDecorator: true */
var ElementRendererDecorator = (function () {

  return {

    decorateRenderer: function (renderer) {
      this.elementRenderer = renderer;
      if (this.elementRenderer.asynch === true) {
        this.asynch = true;
      }
    },

    init: function (element, container) {
      if (this.elementRenderer.asynch === true) {
        var that = this;

        this.elementRenderer.drawReadyCallback = (function () {
          var self = that;

          return function (uiElement, element) {
            self.doInit(uiElement, element);
            if (self.drawReadyCallback) {
              self.drawReadyCallback(uiElement, element);
            }
          };
        })();

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

    updatePosition: function (uiEdge) {
      this.elementRenderer.updatePosition(uiEdge);
      this.doUpdatePosition(uiEdge);
    },

    doInit: function (element, container) {
    },

    doInitDefs: function (defs) {
    },

    doUpdatePosition: function (uiEdge) {
    }

  };

}());