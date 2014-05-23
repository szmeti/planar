/* global D3Engine: true */
var D3Engine = (function () {

  function D3Engine() {
  }

  utils.mixin(D3Engine.prototype, Engine);

  utils.mixin(D3Engine.prototype, {

    initEngine: function (container, width, height) {
      this.svg = d3.select(container).
        append('svg').
        attr('width', width).
        attr('height', height);
    },

    beforeRender: function (vertices, edges) {
      this.addElements('edge', edges);
      this.addElements('vertex', vertices);
    },

    addElements: function (type, elements) {
      var elementSet = this.svg.selectAll('.' + type).data(elements, function (uiElement) {
        return uiElement.id;
      });

      var element = elementSet.enter().append('g');

      element.attr('class', function (uiElement) {
        var elementType = uiElement[type].getProperty(PROP_TYPE);
        return type + ' ' + elementType;
      });

      element.each(function (uiElement) {
        var elementRenderer = ElementRendererProvider.getRenderer(uiElement[type], 'd3', type);
        elementRenderer.render(uiElement, d3.select(this));
      });
    }

  });

  return D3Engine;

}());