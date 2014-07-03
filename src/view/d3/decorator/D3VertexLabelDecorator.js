/* global D3VertexLabelDecorator: true */
var D3VertexLabelDecorator = (function () {

  function D3VertexLabelDecorator(rendererToBeDecorated, settings) {
    this.renderer = rendererToBeDecorated;

    //if doInit() is called from asynch callback the context will change, so that the settings won't be recognized.
    // Don't move this function from this closure.
    this.doInit = function (element, container) {
      var containerBox = container.node().getBBox();

      var edge = containerBox.height / 2;
      var padding = settings.padding;
      if (settings.labelTop) {
        edge = -edge;
        padding = -padding;
      }

      var yPosition = edge;
      yPosition += settings.labelInside ? -padding : padding;

      var label = element.vertex.getProperty(settings.labelPropertyKey);

      container.append('text').
        attr('class', 'custom-label').
        attr('text-anchor', 'middle').
        attr('y', yPosition).
        text(label);
    };
  }

  utils.mixin(D3VertexLabelDecorator.prototype, GraphDecorator);

  return D3VertexLabelDecorator;

}());