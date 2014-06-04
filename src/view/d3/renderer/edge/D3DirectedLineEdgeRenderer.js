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

  var connectedVertices = function (edge, v1, v2) {
    return (edge.outVertex.id === v1.id && edge.inVertex.id === v2.id) ||
           (edge.outVertex.id === v2.id && edge.inVertex.id === v1.id);
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

  var calculateXRadius = function(actualEdge,countOfEdges, distanceOfMidpoints) {
    var radiusConstant = 100000 / distanceOfMidpoints;
    radiusConstant = Math.min(radiusConstant, 420);
    radiusConstant = Math.max(radiusConstant, 230);
    var diameter = (countOfEdges - 1) * radiusConstant;
    var maxRadius = diameter / 2;
    return -maxRadius + actualEdge * radiusConstant;
  };

  var calculateMidPointByIntersection = function(intersection, element) {
    var boundingBox = element.boundingBox;


    if (boundingBox.topEdge() + element.y === intersection.y) {
      return {
        point : new Point(element.x, element.y - (boundingBox.totalHeight() / 2)),
        horizontal : true
      };
    } else if (boundingBox.bottomEdge() + element.y === intersection.y) {
      return {
        point : new Point(element.x, element.y + (boundingBox.totalHeight() / 2)),
        horizontal : true
      };
    } else if (boundingBox.leftEdge() + element.x  === intersection.x) {
      return {
        point : new Point(element.x - (boundingBox.totalWidth() / 2), element.y),
        horizontal : false
      };
    } else if (boundingBox.rightEdge() + element.x === intersection.x) {
      return {
        point : new Point(element.x + (boundingBox.totalWidth() / 2), element.y),
        horizontal : false
      };
    }
  };

  return {

    init: function (edge, element) {
      var text = element.append('text')
        .attr('id', 'text-of-label-'+ edge.id)
        .attr('x', 10)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
//        .attr('transform', 'translate(0,5)')
        .attr('class', 'edge-label');

//      var textPath = text.append('textPath').attr('startOffset', '50%')
//        .attr('xlink:href', '#edgeLabel'+ edge.id);

      text.append('tspan')
        .attr('baseline-shift', 'super')
        .text(edge.edge.label);

      edge.uiElement = element.append('path')
        .attr('id', 'edgeLabel')
        .attr('class', 'directed-edge arrow')
        .attr('marker-end','url(#arrow)')
        .attr('style', 'fill: none;stroke: #666;stroke-width: 1.5px;');
    },

    initDefs: function (defs) {
      defs.append('marker')
        .attr('id', 'arrow')
        .attr('refX', 10)
        .attr('refY', 2)
        .attr('markerWidth', 10)
        .attr('markerHeight', 4)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,0L10,2L0,4');
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
        outHeight = heightOf(edge.outVertex),
        inVertexEdges = edge.inVertex.vertex.getEdges(BOTH);

      var inVertexRect = new Rect(edge.inVertex.x - (inWidth / 2), edge.inVertex.y - (inHeight / 2), inWidth, inHeight);
      var outVertexRect = new Rect(edge.outVertex.x - (outWidth / 2), edge.outVertex.y - (outHeight / 2), outWidth, outHeight);

      var intersectionOnOutVertex = pointOnEdge(outVertexRect, inVertexRect);
      var intersectionOnInVertex = pointOnEdge(inVertexRect, outVertexRect);

      var radiusX = 0, radiusY = 0, indexOfCurrentEdge = 0, siblingEdges = 0;

      for (var i = 0; i < inVertexEdges.length; i++) {
        if (!connectedVertices(inVertexEdges[i], edge.outVertex, edge.inVertex)) {
          continue;
        }

        if (edge.id < inVertexEdges[i].id) {
          indexOfCurrentEdge++;
        }

        siblingEdges++;
      }
      var inEdgeMidPoint = calculateMidPointByIntersection(intersectionOnInVertex, edge.inVertex),
          outEdgeMidPoint = calculateMidPointByIntersection(intersectionOnOutVertex, edge.outVertex);

      var distanceOfMidPoints = distanceOfPoints(inEdgeMidPoint.point, outEdgeMidPoint.point),
          radius = calculateXRadius(indexOfCurrentEdge, siblingEdges, distanceOfPoints(inEdgeMidPoint.point, outEdgeMidPoint.point));

      radiusX = inEdgeMidPoint.horizontal ? radius : distanceOfMidPoints;
      radiusY = inEdgeMidPoint.horizontal ? distanceOfMidPoints : radius;

      var sweep = isLeftOf(outEdgeMidPoint.point, inEdgeMidPoint.point) !== (indexOfCurrentEdge < siblingEdges / 2);

      d3.select('#text-of-label-'+ edge.id).attr('x', inEdgeMidPoint.point.x + distanceOfMidPoints / 2);
      d3.select('#text-of-label-'+ edge.id).attr('y', inEdgeMidPoint.point.y + distanceOfMidPoints / 2);

      line.attr('id', 'edgeLabel'+ edge.id);
      line.attr('d', 'M' + outEdgeMidPoint.point.x + ',' + outEdgeMidPoint.point.y + 'A ' + radiusX + ' ' + radiusY  + ' 0 0 '+ (sweep ? 1 : 0) +' ' + inEdgeMidPoint.point.x + ' ' + inEdgeMidPoint.point.y);
    }

  };

}());