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
    var radiusConstant = 25000 / distanceOfMidpoints;
    radiusConstant = Math.min(radiusConstant, 105);
    radiusConstant = Math.max(radiusConstant, 55);
    var diameter = (countOfEdges - 1) * radiusConstant;
    var maxRadius = diameter / 2;
    return Math.abs(-maxRadius + actualEdge * radiusConstant);
  };

  var calculateMidPointByIntersection = function(intersection, element) {
    var uiElement = element.uiElement;

    var width = uiElement[0][0].getBBox().width;
    var height = uiElement[0][0].getBBox().height;
    var halfWidth = width / 2;
    var halfHeight = height / 2;


    if (element.y - halfHeight === intersection.y) {
      return {
        point : new Point(element.x, element.y - halfHeight),
        horizontal : true
      };
    } else if (halfHeight + element.y === intersection.y) {
      return {
        point : new Point(element.x, element.y + halfHeight),
        horizontal : true
      };
    } else if (element.x - halfWidth  === intersection.x) {
      return {
        point : new Point(element.x - halfWidth, element.y),
        horizontal : false
      };
    } else if (halfWidth + element.x === intersection.x) {
      return {
        point : new Point(element.x + halfWidth, element.y),
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
        .attr('alignment-baseline', 'central')
        .attr('text-anchor', 'middle')
        .attr('class', 'edge-label');

      text.append('tspan')
        .attr('baseline-shift', 'super')
        .text(edge.edge.label);

      edge.uiElement = element.append('path')
        .attr('id', 'edgeLabel')
        .attr('class', 'directed-edge arrow')
        .attr('marker-end','url(#arrow)')
        .attr('style', 'fill: none;stroke: #666;stroke-width: 1.5px;');

      if(edge.edge.label === 'references') {
        edge.uiElement.attr('stroke-dasharray', '5,5');
      }
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

      var isEdgeBelowCenter = (indexOfCurrentEdge < siblingEdges / 2);
      var midPointOfDistance = new Point((inEdgeMidPoint.point.x + outEdgeMidPoint.point.x) / 2, (inEdgeMidPoint.point.y + outEdgeMidPoint.point.y) / 2);
      var isAboveInOut = isAbove(inEdgeMidPoint.point, outEdgeMidPoint.point);
      var isLeftInOut = isLeftOf(inEdgeMidPoint.point, outEdgeMidPoint.point);

      var referenceVertex = edge.inVertex.id > edge.outVertex.id ? edge.inVertex : edge.outVertex;
      var direction = edge.inVertex === referenceVertex;

      var referencePoint = edge.inVertex.id > edge.outVertex.id ? inEdgeMidPoint.point : outEdgeMidPoint.point;
      var otherPoint = edge.inVertex.id > edge.outVertex.id ? outEdgeMidPoint.point : inEdgeMidPoint.point;

      var sinAlphaAbs = Math.abs(inEdgeMidPoint.point.y - outEdgeMidPoint.point.y) / distanceOfMidPoints;
      var alpha = Math.asin(sinAlphaAbs) * 180 / Math.PI;

      var sinAlpha = (referencePoint.y - otherPoint.y) / distanceOfMidPoints;
      var cosAlpha = (referencePoint.x - otherPoint.x) / distanceOfMidPoints;

      var sweepFlag = (direction !== isEdgeBelowCenter ? 1 : 0);

      var xAxisRotation = isAboveInOut === isLeftInOut ? alpha : -alpha;

      var labelX = radius / 1.75 * sinAlpha;
      var labelY = radius / 1.75 * cosAlpha;

      labelX = isEdgeBelowCenter ? -labelX : labelX;
      labelY = isEdgeBelowCenter ? -labelY : labelY;

      d3.select('#text-of-label-'+ edge.id).attr('x', midPointOfDistance.x + labelX);
      d3.select('#text-of-label-'+ edge.id).attr('y', midPointOfDistance.y - labelY);

      labelY *= isAboveInOut ? -1 : 1;

      line.attr('class', 'inEdgeMidPointx '+inEdgeMidPoint.point.x + ' inEdgeMidPointy ' + inEdgeMidPoint.point.y + 'outEdgeMidPointx '+outEdgeMidPoint.point.x + ' outEdgeMidPointy ' + outEdgeMidPoint.point.y + ' labelx ' + labelX + ' labelY ' + labelY + ' isleftoinout ' + isLeftInOut + ' isaboveinout ' + isAboveInOut + ' isedgebelowcenter ' + isEdgeBelowCenter + ' indexofcurrentedge ' + indexOfCurrentEdge + ' sinalpha' + sinAlphaAbs + ' referencevertex ' + referenceVertex.id + ' direction '+ direction);

      line.attr('id', 'edgeLabel'+ edge.id);
      line.attr('d', 'M' + outEdgeMidPoint.point.x + ',' + outEdgeMidPoint.point.y + 'A ' + distanceOfMidPoints * 0.55 + ' ' + radius  + ' '+ xAxisRotation +' 0 '+ sweepFlag +' ' + inEdgeMidPoint.point.x + ' ' + inEdgeMidPoint.point.y);
    }

  };

}());