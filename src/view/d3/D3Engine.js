/* global D3Engine: true */
var D3Engine = (function () {

  function D3Engine() {
  }

  utils.mixin(D3Engine.prototype, Engine);

  utils.mixin(D3Engine.prototype, {

    initEngine: function (settings, graph) {

      var svg = this.svg = d3.select(settings.container)
        .append('svg')
        .attr('id','graph-canvas')
        .attr('class', 'svg canvas')
        .attr('width',  settings.width)
        .attr('height', settings.height);

      svg.append('rect')
        .attr('class', 'overlay')
        .attr('width', settings.width)
        .attr('height', settings.height);

      var defs = svg.append('defs');

      this.zoomPanManager = new D3ZoomPanManager(svg, defs, settings, graph);
      this.zoomPanManager.init();

      var d3Renderers = ElementRendererProvider.getAll('d3');

      for (var i = 0; i < d3Renderers.length; i++){
        if (typeof d3Renderers[i].initDefs === 'function') {
          d3Renderers[i].initDefs(defs);
        }
      }
    },

    beforeRender: function (vertices, edges) {
      var edgeSet = bindData(this.zoomPanManager.getGraphContainer(), 'edge', edges);
      addEnterSection('edge', edgeSet);

      var vertexSet = bindData(this.zoomPanManager.getGraphContainer(), 'vertex', vertices);
      var vertexEnter = addEnterSection('vertex', vertexSet);
      translateVertices(vertexSet);
      var vertexManager = new D3VertexManager(vertexEnter);
      vertexManager.addDragToVertices();
      updateEdgePositions(edgeSet);
      this.zoomPanManager.getNavigator().render();
    },

    saveAsImage: function() {
      var imageDownloader = new D3SvgImageDownloader(d3.select('#graph-canvas'), true);
      imageDownloader.download();
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

  function updateEdgePositions(edgeSet) {
    edgeSet.each(function (uiEdge) {
      var edgeRenderer = ElementRendererProvider.getRenderer(uiEdge.edge, 'd3', 'edge');
      edgeRenderer.updatePosition(uiEdge);
    });
  }

  return D3Engine;

}());