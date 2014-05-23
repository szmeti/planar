/* global D3Engine: true */
var D3Engine = (function () {

  function D3Engine() {
  }

  utils.mixin(D3Engine.prototype, Engine);

  utils.mixin(D3Engine.prototype, {

    initEngine: function (container, width, height) {
      function zoom() {
        svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
      }

      var svg = this.svg = d3.select(container).
        append('svg').
        attr('width', width).
        attr('height', height).
        append('g').
        call(d3.behavior.zoom().scaleExtent([1, 8]).on('zoom', zoom))
        .append('g');

      svg.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height);
    },

    beforeRender: function (vertices, edges) {
      var edgeSet = bindData(this.svg, 'edge', edges);
      addEnterSection('edge', edgeSet);

      var vertexSet = bindData(this.svg, 'vertex', vertices);
      var vertexEnter = addEnterSection('vertex', vertexSet);
      translateVertices(vertexSet);
      addDragToVertices(vertexEnter);

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
      var elementType = uiElement[type].getProperty(PROP_TYPE);
      var clazz = type;

      if (elementType) {
        clazz += ' ' + elementType;
      }

      return clazz;
    });

    element.each(function (uiElement) {
      var elementRenderer = ElementRendererProvider.getRenderer(uiElement[type], 'd3', type);
      elementRenderer.init(uiElement, d3.select(this));
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

  function addDragToVertices(element) {
    var drag = d3.behavior.drag();

    drag.on('dragstart', function (uiVertex) {
      d3.event.sourceEvent.stopPropagation();
      var graph = uiVertex.vertex.getGraph();
      graph.trigger('vertexDragStart', uiVertex);
    });

    drag.on('drag', function (uiVertex) {
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