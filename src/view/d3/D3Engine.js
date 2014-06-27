/* global D3Engine: true */
var D3Engine = (function () {

  function D3Engine() {
  }

  utils.mixin(D3Engine.prototype, Engine);

  utils.mixin(D3Engine.prototype, {

    initEngine: function (container, width, height) {
      var zoomEnabled     = true,
        dragEnabled     = true,
        scale           = 1,
        translation     = [0,0],
        base            = null,
        wrapperBorder   = 1,
        navigator         = null,
        navigatorPadding  = 20,
        navigatorScale    = 0.25;

      var xScale = d3.scale.linear()
        .domain([-width / 2, width / 2])
        .range([0, width]);

      var yScale = d3.scale.linear()
        .domain([-height / 2, height / 2])
        .range([height, 0]);

      var zoomHandler = function(newScale) {
        if (!zoomEnabled) { return; }
        if (d3.event) {
          scale = d3.event.scale;
        } else {
          scale = newScale;
        }
        if (dragEnabled) {
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

        navigator.scale(scale).render();
      }; // startoff zoomed in a bit to show pan/zoom rectangle
      
      function initCommonDefs(svgDefs) {
        svgDefs.append('clipPath')
          .attr('id', 'wrapperClipPath')
          .attr('class', 'wrapper clipPath')
          .append('rect')
          .attr('class', 'background')
          .attr('width', width)
          .attr('height', height);

        svgDefs.append('clipPath')
          .attr('id', 'navigatorClipPath')
          .attr('class', 'navigator clipPath')
          .attr('width', width)
          .attr('height', height)
          .append('rect')
          .attr('class', 'background')
          .attr('width', width)
          .attr('height', height);

        var filter = svgDefs.append('svg:filter')
          .attr('id', 'navigatorDropShadow')
          .attr('x', '-20%')
          .attr('y', '-20%')
          .attr('width', '150%')
          .attr('height', '150%');

        filter.append('svg:feOffset')
          .attr('result', 'offOut')
          .attr('in', 'SourceGraphic')
          .attr('dx', '1')
          .attr('dy', '1');

        filter.append('svg:feColorMatrix')
          .attr('result', 'matrixOut')
          .attr('in', 'offOut')
          .attr('type', 'matrix')
          .attr('values', '0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.5 0');

        filter.append('svg:feGaussianBlur')
          .attr('result', 'blurOut')
          .attr('in', 'matrixOut')
          .attr('stdDeviation', '10');

        filter.append('svg:feBlend')
          .attr('in', 'SourceGraphic')
          .attr('in2', 'blurOut')
          .attr('mode', 'normal');

        var navigatorRadialFill = svgDefs.append('radialGradient')
          .attr({
            id:'navigatorGradient',
            gradientUnits:'userSpaceOnUse',
            cx:'500',
            cy:'500',
            r:'400',
            fx:'500',
            fy:'500'
          });
        navigatorRadialFill.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', '#FFFFFF');
        navigatorRadialFill.append('stop')
          .attr('offset', '40%')
          .attr('stop-color', '#EEEEEE');
        navigatorRadialFill.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', '#E0E0E0');

        var outerWrapper = svg.append('g')
          .attr('class', 'wrapper outer')
          .attr('transform', 'translate(0, ' + navigatorPadding + ')');

        outerWrapper.append('rect')
          .attr('class', 'background')
          .attr('width', width + wrapperBorder*2)
          .attr('height', height + wrapperBorder*2);

        var innerWrapper = outerWrapper.append('g')
          .attr('class', 'wrapper inner')
          .attr('clip-path', 'url(#wrapperClipPath)')
          .attr('transform', 'translate(' + (wrapperBorder) + ',' + (wrapperBorder) + ')')
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
        .scaleExtent([1, 5])
        .on('zoom.canvas', zoomHandler);

      var svg = this.svg = d3.select(container)
        .append('svg')
        .attr('class', 'svg canvas')
        .attr('width',  width  + (wrapperBorder*2) + navigatorPadding*2 + (width*navigatorScale))
        .attr('height', height + (wrapperBorder*2) + navigatorPadding*2)
        .attr('shape-rendering', 'auto');

      svg.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height);

      var defs = svg.append('defs');
      
      initCommonDefs(defs);

      this.panCanvas = d3.select('#panCanvas');
      this.graphElements = d3.select('#graphElements');

      navigator = this.navigator = new Navigator()
        .zoom(zoom)
        .target(this.panCanvas)
        .navigatorScale(navigatorScale)
        .x(width + navigatorPadding)
        .y(navigatorPadding);

      svg.call(navigator);

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
      this.navigator.render();
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