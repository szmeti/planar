/* global D3DirectedLineEdgeRenderer: true */
var D3DirectedLineEdgeRenderer = (function () {

  return {

    init: function (edge, element) {
      var lineWeight = edge.edge.getProperty(settings.edge.lineWeightPropertyKey) || settings.edge.defaultLineWeight;
      var markerEnd = settings.edge.useArrows ? 'url(#arrow)' : '';

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
        .attr('marker-end', markerEnd)
        .attr('style', 'stroke-width: ' + lineWeight + 'px;');

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

    updatePosition: function(edge) {
      var line = edge.uiElement;

      var calculator = new DirectedLineEdgeCalculator(edge);
      var edgeProprties = calculator.calculate();

      d3.select('#text-of-label-'+ edge.id).attr('x', edgeProprties.labelPosition.x);
      d3.select('#text-of-label-'+ edge.id).attr('y', edgeProprties.labelPosition.y);

      line.attr('id', 'edgeLabel'+ edge.id);
      line.attr('d', 'M' + edgeProprties.startPoint.x + ',' + edgeProprties.startPoint.y + 'A ' + edgeProprties.radiusX + ' ' + edgeProprties.radiusY  + ' '+ edgeProprties.xAxisRotation +' 0 '+ edgeProprties.sweepFlag +' ' + edgeProprties.endPoint.x + ' ' + edgeProprties.endPoint.y);
    }

  };

}());

/* global DirectedLineEdgeCalculator: true */
var DirectedLineEdgeCalculator = ( function () {

  function DirectedLineEdgeCalculator(edge) {
    this.edge = edge;
  }

  var calculateRadius = function(actualEdge,countOfEdges, distanceOfMidpoints) {
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

    return GeometryUtils.findClosestMidpointToIntersection(intersection, element, width, height);
  };

  var countSiblingsAndFindCurrent = function(edge) {
    var inVertexEdges = edge.inVertex.vertex.getEdges(BOTH);
    var indexOfCurrentEdge = 0, siblingEdges = 0;

    for (var i = 0; i < inVertexEdges.length; i++) {
      if (!inVertexEdges[i].connects(edge.outVertex, edge.inVertex)) {
        continue;
      }

      if (edge.id < inVertexEdges[i].id) {
        indexOfCurrentEdge++;
      }

      siblingEdges++;
    }

    return {
      indexOfCurrentEdge : indexOfCurrentEdge,
      siblingEdges : siblingEdges
    };
  };

  var calculateLabelPosition = function(radius, midPointOfDistance, isEdgeBelowCenter, sinAlpha, cosAlpha) {
    var labelX = radius / 1.75 * sinAlpha;
    var labelY = radius / 1.75 * cosAlpha;

    labelX = isEdgeBelowCenter ? -labelX : labelX;
    labelY = isEdgeBelowCenter ? -labelY : labelY;

    return {
      x: midPointOfDistance.x + labelX,
      y: midPointOfDistance.y - labelY
    };
  };

  utils.mixin(DirectedLineEdgeCalculator.prototype, {

    calculate: function () {
      var inWidth = SvgUtils.widthOf(this.edge.inVertex),
          inHeight = SvgUtils.heightOf(this.edge.inVertex),
          outWidth = SvgUtils.widthOf(this.edge.outVertex),
          outHeight = SvgUtils.heightOf(this.edge.outVertex);

      //create rectangles from vertices
      var inVertexRect = new Rectangle(this.edge.inVertex.x - (inWidth / 2), this.edge.inVertex.y - (inHeight / 2), inWidth, inHeight);
      var outVertexRect = new Rectangle(this.edge.outVertex.x - (outWidth / 2), this.edge.outVertex.y - (outHeight / 2), outWidth, outHeight);

      //find intersection point on the sides
      var intersectionOnOutVertex = GeometryUtils.findIntersectionOnClosestSide(outVertexRect, inVertexRect);
      var intersectionOnInVertex = GeometryUtils.findIntersectionOnClosestSide(inVertexRect, outVertexRect);

      var inEdgeMidPoint = calculateMidPointByIntersection(intersectionOnInVertex, this.edge.inVertex);
      var outEdgeMidPoint = calculateMidPointByIntersection(intersectionOnOutVertex, this.edge.outVertex);
      var distanceOfMidPoints = GeometryUtils.distanceOfPoints(inEdgeMidPoint.point, outEdgeMidPoint.point);

      var connectedEdges = countSiblingsAndFindCurrent(this.edge);

      var radius = calculateRadius(connectedEdges.indexOfCurrentEdge, connectedEdges.siblingEdges, distanceOfMidPoints);
      var isEdgeBelowCenter = (connectedEdges.indexOfCurrentEdge < connectedEdges.siblingEdges / 2);

      var isAboveInOut = GeometryUtils.isAbove(inEdgeMidPoint.point, outEdgeMidPoint.point);
      var isLeftInOut = GeometryUtils.isLeftOf(inEdgeMidPoint.point, outEdgeMidPoint.point);

      var referenceVertex = this.edge.inVertex.id > this.edge.outVertex.id ? this.edge.inVertex : this.edge.outVertex;
      var direction = this.edge.inVertex === referenceVertex;

      var referencePoint = this.edge.inVertex.id > this.edge.outVertex.id ? inEdgeMidPoint.point : outEdgeMidPoint.point;
      var otherPoint = this.edge.inVertex.id > this.edge.outVertex.id ? outEdgeMidPoint.point : inEdgeMidPoint.point;

      var sinAlphaAbs = Math.abs(inEdgeMidPoint.point.y - outEdgeMidPoint.point.y) / distanceOfMidPoints;
      var alpha = Math.asin(sinAlphaAbs) * 180 / Math.PI;

      var sinAlpha = (referencePoint.y - otherPoint.y) / distanceOfMidPoints;
      var cosAlpha = (referencePoint.x - otherPoint.x) / distanceOfMidPoints;

      var midPointOfDistance = new Point((inEdgeMidPoint.point.x + outEdgeMidPoint.point.x) / 2, (inEdgeMidPoint.point.y + outEdgeMidPoint.point.y) / 2);

      return {
        startPoint : {
          x: outEdgeMidPoint.point.x,
          y: outEdgeMidPoint.point.y
        },
        endPoint : {
          x: inEdgeMidPoint.point.x,
          y: inEdgeMidPoint.point.y
        },
        labelPosition : calculateLabelPosition(radius,midPointOfDistance, isEdgeBelowCenter, sinAlpha, cosAlpha),
        radiusX : distanceOfMidPoints * 0.55,
        radiusY : radius,
        xAxisRotation : isAboveInOut === isLeftInOut ? alpha : -alpha,
        sweepFlag : direction !== isEdgeBelowCenter ? 1 : 0
      };
    }

  });

  return DirectedLineEdgeCalculator;

}());