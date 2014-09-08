/* global D3LineEdgeRenderer: true */
var D3LineEdgeRenderer = (function () {

  function D3LineEdgeRenderer() {
  }

  utils.mixin(D3LineEdgeRenderer.prototype, {

    init: function (uiEdge, element) {
      var edge = uiEdge.edge;
      var instanceSettings = edge.getGraph().getSettings();

      var lineWeight = edge.getProperty(instanceSettings.edge.lineWeightPropertyKey) || instanceSettings.edge.defaultLineWeight;
      uiEdge.uiElement = element.append('line').attr('style', 'stroke-width: ' + lineWeight + 'px;');
    },

    initDefs: function () {
    },

    updatePosition: function (edge) {
      var line = edge.uiElement;

      line.attr('x1', function (uiEdge) {
        return uiEdge.inVertex.x;
      });

      line.attr('y1', function (uiEdge) {
        return uiEdge.inVertex.y;
      });

      line.attr('x2', function (uiEdge) {
        return uiEdge.outVertex.x;
      });

      line.attr('y2', function (uiEdge) {
        return uiEdge.outVertex.y;
      });
    }

  });

  return D3LineEdgeRenderer;

}());