/* global D3EdgeLabelDecorator: true */
var D3EdgeLabelDecorator = (function () {

  function D3EdgeLabelDecorator(rendererToBeDecorated) {
    this.renderer = rendererToBeDecorated;
  }

  utils.mixin(D3EdgeLabelDecorator.prototype, GraphDecorator);

  utils.mixin(D3EdgeLabelDecorator.prototype, {
    doInit: function (element, container) {
      var text = container.append('text')
        .attr('id', 'text-of-label-'+ element.edge.id)
        .attr('x', 10)
        .attr('y', 100)
        .attr('alignment-baseline', 'central')
        .attr('text-anchor', 'middle')
        .attr('class', 'edge-label');

      text.append('tspan')
        .attr('baseline-shift', 'super')
        .text(element.edge.label);
    }
  });

  return D3EdgeLabelDecorator;

}());