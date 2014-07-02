/* global D3LineEdgeRenderer: true */
var D3LineEdgeRenderer = (function () {

  return {

    init: function (edge, element) {
      var lineWeight = edge.edge.getProperty(settings.edge.lineWeightPropertyKey) || settings.edge.defaultLineWeight;
      edge.uiElement = element.append('line').attr('style', 'stroke-width: ' + lineWeight + 'px;');
    },

    initDefs: function (defs) {},

    updatePosition: function(edge) {
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

  };

}());