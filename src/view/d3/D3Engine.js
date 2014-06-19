/* global D3Engine: true */
var D3Engine = (function () {

  function D3Engine() {
  }

  function caculcateDragLimit(point, distanceToEdge, minLimit, maxLimit) {
    var paddingFromEdge = 10;
    if (point - distanceToEdge < minLimit) {
      return minLimit + distanceToEdge + paddingFromEdge;
    } else if (point + distanceToEdge > maxLimit) {
      return maxLimit - distanceToEdge - paddingFromEdge;
    } else {
      return point;
    }
  }

  utils.mixin(D3Engine.prototype, Engine);

  utils.mixin(D3Engine.prototype, {

    initEngine: function (container, width, height) {

      var svgContainer = d3.select(container).
        append('svg').
        attr('class', 'svg-container').
        attr('width', width).
        attr('height', height).
        append('g');

      var widthOfDrawArea = width * 0.75;
      var heightOfDrawArea = height * 0.75;

      var graphSvg = this.svg = d3.select(document.createElement('svg')).
        append('svg').
        attr('class', 'graph-container').
        attr('width', widthOfDrawArea).
        attr('height', heightOfDrawArea);

      var defs = graphSvg.append('defs');

      var d3Renderers = ElementRendererProvider.getAll('d3');

      for (var i = 0; i < d3Renderers.length; i++){
        if (typeof d3Renderers[i].initDefs === 'function') {
          d3Renderers[i].initDefs(defs);
        }
      }

      var canvas = new Canvas().width(widthOfDrawArea).height(heightOfDrawArea);
      svgContainer.call(canvas);

      canvas.addItem(this.svg);
    },

    beforeRender: function (vertices, edges) {
      var edgeSet = bindData(this.svg, 'edge', edges);
      addEnterSection('edge', edgeSet);

      var vertexSet = bindData(this.svg, 'vertex', vertices);
      var vertexEnter = addEnterSection('vertex', vertexSet);
      translateVertices(vertexSet);
      addDragToVertices(vertexEnter, this.svg);

      updateEdgePositions(edgeSet);
    }

  });

  function bindData(svg, type, elements) {
    return svg.selectAll('.' + type).data(elements, function (uiElement) {
      return uiElement.id;
    });
  }

  function addEnterSection(type, elementSet) {
    var element = elementSet.enter().append('g');

    element.attr('class', function (uiElement) {
      var elementType = uiElement[type].getPropertyUnfiltered(PROP_TYPE);
      var clazz = type;

      if (elementType) {
        clazz += ' ' + elementType;
      }

      return clazz;
    });

    element.each(function (uiElement) {
      var elementRenderer = ElementRendererProvider.getRenderer(uiElement[type], 'd3', type);
      uiElement.g = d3.select(this);
      elementRenderer.init(uiElement,  uiElement.g);
    });

    element.on('click', function (uiElement) {
      var graph = uiElement[type].getGraph();
      graph.trigger(type + 'Clicked', uiElement);
    });

    elementSet.exit().remove();

    return element;
  }

  function translateVertices(vertexSet) {
    vertexSet.attr('transform', function (uiVertex) {
      return 'translate(' + uiVertex.x + ',' + uiVertex.y + ')';
    });
  }

  function addDragToVertices(element, container) {
    var drag = d3.behavior.drag();

    drag.on('dragstart', function (uiVertex) {
      d3.event.sourceEvent.stopPropagation();
      var graph = uiVertex.vertex.getGraph();
      graph.trigger('vertexDragStart', uiVertex);
    });

    drag.on('drag', function (uiVertex) {
//      var containerWidth = parseInt(container.attr('width'));
//      var containerHeight = parseInt(container.attr('height'));
//
//      var halfWidth = SvgUtils.widthOf(uiVertex) / 2;
//      var halfHeight = SvgUtils.heightOf(uiVertex) / 2;
//
//      var newX = caculcateDragLimit(d3.event.x, halfWidth, 0, containerWidth);
//      var newY = caculcateDragLimit(d3.event.y, halfHeight, 0, containerHeight);

      uiVertex.x = d3.event.x;
      uiVertex.y = d3.event.y;

      var graph = uiVertex.vertex.getGraph();
      graph.trigger('vertexDrag', uiVertex);
    });

    drag.on('dragend', function (uiVertex) {
      var graph = uiVertex.vertex.getGraph();
      graph.trigger('vertexDragEnd', uiVertex);
    });

    element.call(drag);
  }

  function updateEdgePositions(edgeSet) {
    edgeSet.each(function (uiEdge) {
      var edgeRenderer = ElementRendererProvider.getRenderer(uiEdge.edge, 'd3', 'edge');
      edgeRenderer.updatePosition(uiEdge);
    });
  }

  return D3Engine;

}());