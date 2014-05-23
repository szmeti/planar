/* global D3LineEdgeRenderer: true */
var D3LineEdgeRenderer = (function () {

  return {

    render: function (edge, element) {
      var line = element.append('line');

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