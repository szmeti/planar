/* global D3DirectedLineEdgeRenderer: true */
var D3DirectedLineEdgeRenderer = (function () {

  // starting with Point and Rectangle Types, as they ease calculation
  var Point = function(x, y) {
    return { x: x, y: y };
  };

  var Rect  = function(x, y, w, h) {
    return { x: x, y: y, width: w, height: h };
  };

  var isLeftOf = function(pt1, pt2) { return pt1.x < pt2.x; };
  var isAbove  = function(pt1, pt2) { return pt1.y < pt2.y; };

  var centerOf = function(rect) {
    return new Point(
      rect.x + rect.width / 2,
      rect.y + rect.height / 2
    );
  };

  var gradient = function(pt1, pt2) {
    return (pt2.y - pt1.y) / (pt2.x - pt1.x);
  };

  var aspectRatio = function(rect) { return rect.height / rect.width; };

  var widthOf = function(element) {
    return element.g[0][0].getBBox().width;
  };

  var heightOf = function(element) {
    return element.g[0][0].getBBox().height;
  };

  var distanceOfPoints = function(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  // now, this is where the fun takes place
  var pointOnEdge = function(fromRect, toRect) {
    var centerA = centerOf(fromRect),
      centerB = centerOf(toRect),
    // calculate the gradient from rectA to rectB
      gradA2B = gradient(centerA, centerB),
    // grab the aspectRatio of rectA
    // as we want any dimensions to work with the script
      aspectA = aspectRatio(fromRect),

    // grab the half values, as they are used for the additional point
      h05 = fromRect.width / 2,
      w05 = fromRect.height / 2,

    // the norm is the normalized gradient honoring the aspect Ratio of rectA
      normA2B = Math.abs(gradA2B / aspectA),

    // the additional point
      add = new Point(
        // when the rectA is left of rectB we move right, else left
        (isLeftOf(centerA, centerB) ? 1 : -1) * h05,
        // when the rectA is below
        (isAbove(centerA, centerB)  ? 1 : -1) * w05
      );

    // norm values are absolute, thus we can compare whether they are
    // greater or less than 1
    if (normA2B < 1) {
      // when they are less then 1 multiply the y component with the norm
      add.y *= normA2B;
    } else {
      // otherwise divide the x component by the norm
      add.x /= normA2B;
    }
    // this way we will stay on the edge with at least one component of the result
    // while the other component is shifted towards the center

    return new Point(centerA.x + add.x, centerA.y + add.y);
  };


  return {

    init: function (edge, element) {
      edge.uiElement = element.append('path')
        .attr('class', 'directed-edge arrow')
        .attr('marker-end','url(#arrow)')
        .attr('style', 'fill: none;stroke: #666;stroke-width: 1.5px;');
    },

    initDefs: function (defs) {
      defs.append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15)
        .attr('refY', -1.5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5');
    },

    linkCurve: function(sourceX, sourceY, targetX, targetY) {
      var dx = targetX - sourceX,
          dy = targetY - sourceY,
          dr = Math.sqrt(dx * dx + dy * dy);
      return 'M' + sourceX + ',' + sourceY + 'Q '+ dr +' '+ dy +' '+ targetX +' '+ targetY;
    },

    updatePosition: function(edge) {
      var line = edge.uiElement,
        inWidth = widthOf(edge.inVertex),
        inHeight = heightOf(edge.inVertex),
        outWidth = widthOf(edge.outVertex),
        outHeight = heightOf(edge.outVertex);

      var inVertexRect = new Rect(edge.inVertex.x - (inWidth / 2), edge.inVertex.y - (inHeight / 2), inWidth, inHeight);
      var outVertexRect = new Rect(edge.outVertex.x - (outWidth / 2), edge.outVertex.y - (outHeight / 2), outWidth, outHeight);

      var intersectionOnOutVertex = pointOnEdge(outVertexRect, inVertexRect);
      var intersectionOnInVertex = pointOnEdge(inVertexRect, outVertexRect);




      edge.inVertex.vertex.getEdges(OUT).forEach(function(vertexEdge) {
//        console.log(vertexEdge.id);
      });

//      var countOfSiblins = edge.inVertex.getEdges().length,
//        pointOfHalfDistanceBetweenVertices = new Point((edge.inVertex.x + edge.outVertex.x)/2, (edge.inVertex.y + edge.outVertex.y)/2),
//
//        halfDistanceBetweenVertices = distanceOfPoints(pointOfHalfDistanceBetweenVertices, edge.inVertex);
//
//
////      line.attr('d', D3DirectedLineEdgeRenderer.linkCurve(pointOnOutVertex.x, pointOnOutVertex.y, pointOnInVertex.x, pointOnInVertex.y));
      line.attr('d', 'M' + intersectionOnOutVertex.x + ',' + intersectionOnOutVertex.y + 'L' + intersectionOnInVertex.x + ' '+ intersectionOnInVertex.y);
    }

  };

}());