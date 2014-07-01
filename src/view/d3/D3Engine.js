/* global D3Engine: true */
var D3Engine = (function () {

  function D3Engine() {
  }

  utils.mixin(D3Engine.prototype, Engine);

  utils.mixin(D3Engine.prototype, {

    initEngine: function (container, navigatorContainer, width, height) {
      var scale           = 1,
        translation     = [0,0];
      this.navigatorContainer = navigatorContainer;

      var xScale = d3.scale.linear()
        .domain([-width / 2, width / 2])
        .range([0, width]);

      var yScale = d3.scale.linear()
        .domain([-height / 2, height / 2])
        .range([height, 0]);

      var zoomHandler = function(newScale) {
        if (!settings.zoom.enabled) { return; }
        if (d3.event) {
          scale = d3.event.scale;
        } else {
          scale = newScale;
        }
        if (settings.drag.enabled) {
          var tbound = -height * scale + height,
            bbound = 0,
            lbound = -width * scale + width,
            rbound = 0;
          // limit translation to thresholds
          translation = d3.event ? d3.event.translate : [0, 0];
          translation = [
            Math.max(Math.min(translation[0], rbound), lbound),
            Math.max(Math.min(translation[1], bbound), tbound)
          ];
        }

        d3.select('.panCanvas, .panCanvas .bg')
          .attr('transform', 'translate(' + translation + ')' + ' scale(' + scale + ')');
      };
      
      function initCommonDefs(svgDefs) {
        svgDefs.append('clipPath')
          .attr('id', 'wrapperClipPath')
          .attr('class', 'wrapper clipPath')
          .append('rect')
          .attr('class', 'background')
          .attr('width', width)
          .attr('height', height);

        var outerWrapper = svg.append('g')
          .attr('id','outerWrapper')
          .attr('class', 'wrapper outer');

        outerWrapper.append('rect')
          .attr('class', 'background')
          .attr('width', width + settings.navigator.wrapperBorder*2)
          .attr('height', height + settings.navigator.wrapperBorder*2);

        var innerWrapper = outerWrapper.append('g')
          .attr('class', 'wrapper inner')
          .attr('clip-path', 'url(#wrapperClipPath)')
          .attr('transform', 'translate(' + (settings.navigator.wrapperBorder) + ',' + (settings.navigator.wrapperBorder) + ')')
          .call(zoom);

        innerWrapper.append('rect')
          .attr('class', 'background')
          .attr('width', width)
          .attr('height', height);

        var panCanvas = innerWrapper.append('g')
          .attr('id', 'panCanvas')
          .attr('class', 'panCanvas')
          .attr('width', width)
          .attr('height', height)
          .attr('transform', 'translate(0,0)');

        panCanvas.append('rect')
          .attr('class', 'background')
          .attr('width', width)
          .attr('height', height);

        panCanvas.append('g')
          .attr('id','graphElements')
          .attr('transform', 'scale(0.5)');
      }

      var zoom = d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .scaleExtent([settings.zoom.minScale, settings.zoom.maxScale])
        .on('zoom.canvas', zoomHandler);

      var svg = this.svg = d3.select(container)
        .append('svg')
        .attr('class', 'svg canvas')
        .attr('width',  width  + (settings.navigator.wrapperBorder*2))
        .attr('height', height + (settings.navigator.wrapperBorder*2))
        .attr('shape-rendering', 'auto');

      svg.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height);

      var defs = svg.append('defs');
      
      initCommonDefs(defs);

      this.panCanvas = d3.select('#panCanvas');
      this.graphElements = d3.select('#graphElements');

      this.navigator = initNavigator(navigatorContainer, zoom, width, height);
      initZoomPanControl(svg,zoom);

      var d3Renderers = ElementRendererProvider.getAll('d3');

      for (var i = 0; i < d3Renderers.length; i++){
        if (typeof d3Renderers[i].initDefs === 'function') {
          d3Renderers[i].initDefs(defs);
        }
      }
    },

    beforeRender: function (vertices, edges) {
      var edgeSet = bindData(this.graphElements, 'edge', edges);
      addEnterSection('edge', edgeSet);

      var vertexSet = bindData(this.graphElements, 'vertex', vertices);
      var vertexEnter = addEnterSection('vertex', vertexSet);
      translateVertices(vertexSet);
      addDragToVertices(vertexEnter);

      updateEdgePositions(edgeSet);

      if (utils.exists(this.navigatorContainer)) {
        this.navigator.render();
      }
    }

  });

  function initNavigator(container, zoom, width, height) {
    if (!utils.exists(container)) {
      return;
    }

    var navigatorSvg = d3.select(container)
      .append('svg')
      .attr('width',settings.navigator.paddingLeft*2 + (width*settings.navigator.scale))
      .attr('height', settings.navigator.paddingTop*2 + (height*settings.navigator.scale))
      .attr('class', 'svg canvas');

    var navigator = new Navigator()
      .zoom(zoom)
      .width(width)
      .height(height)
      .target(d3.select('#panCanvas'))
      .navigatorScale(settings.navigator.scale)
      .x(settings.navigator.paddingLeft)
      .y(settings.navigator.paddingTop);

    navigatorSvg.call(navigator);
    return navigator;
  }

  function initZoomPanControl(container, zoom) {
    var zoomPanControl = new ZoomPanControl()
      .target(d3.select('#panCanvas'))
      .zoom(zoom)
      .zoomScale(settings.zoomPanControl.zoomScale)
      .panScale(settings.zoomPanControl.panScale)
      .x(settings.zoomPanControl.paddingLeft)
      .y(settings.zoomPanControl.paddingTop);

    container.call(zoomPanControl);
    zoomPanControl.render();
  }

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