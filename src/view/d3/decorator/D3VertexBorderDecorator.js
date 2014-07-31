/* global D3VertexBorderDecorator: true */
var D3VertexBorderDecorator = (function () {

  function D3VertexBorderDecorator(rendererToBeDecorated) {
    this.decorateRenderer(rendererToBeDecorated);

    //if doInit() is called from asynch callback the context will change, so that the settings won't be recognized.
    // Don't move this function from this closure.
    this.doInit = function (uiElement, container) {
      var vertex = uiElement.vertex;

      var instanceSettings = vertex.getGraph().getSettings();

      var borderColor = vertex.getProperty(instanceSettings.vertex.borderColorPropertyKey) || instanceSettings.vertex.borderColor;
      var borderWeight = vertex.getProperty(instanceSettings.vertex.borderWeightPropertyKey) || instanceSettings.vertex.borderWeight;
      var borderRadius = vertex.getProperty(instanceSettings.vertex.borderRadiusPropertyKey) || instanceSettings.vertex.borderRadius;
      var borderPadding = vertex.getProperty(instanceSettings.vertex.borderPaddingPropertyKey) || instanceSettings.vertex.borderPadding;

      var containerBox = container.node().getBBox();

      container.append('rect')
        .attr('x', -containerBox.width/2 - borderPadding)
        .attr('y', -containerBox.height/2 - borderPadding)
        .attr('rx', borderRadius)
        .attr('ry', borderRadius)
        .attr('style', 'fill:none;stroke:'+borderColor+';stroke-width:'+borderWeight+'px;')
        .attr('width', containerBox.width + 2*borderPadding)
        .attr('height', containerBox.height + 2*borderPadding);
    };
  }

  utils.mixin(D3VertexBorderDecorator.prototype, ElementRendererDecorator);

  return D3VertexBorderDecorator;

}());