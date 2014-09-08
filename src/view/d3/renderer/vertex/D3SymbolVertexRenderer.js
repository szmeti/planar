/* global D3SymbolVertexRenderer: true */
var D3SymbolVertexRenderer = (function () {

  function D3SymbolVertexRenderer(type) {
    utils.checkExists('Type', type);
    this.type = type;
  }

  utils.mixin(D3SymbolVertexRenderer.prototype, {

    init: function (vertex, element) {
      var path = element.append('path');
      path.attr('d', d3.svg.symbol().type(this.type).size(200));
      vertex.uiElement = path;
    },

    initDefs: function () {}

  });

  return D3SymbolVertexRenderer;

}());