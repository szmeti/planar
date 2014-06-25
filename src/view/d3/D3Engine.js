/* global D3Engine: true */
var D3Engine = (function () {

  function D3Engine() {
  }

  function caculcateDragLimit(point, distanceToEdge, minLimit, maxLimit) {
    var paddingFromEdge = 0;
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
      var navigatorPadding = 50;
      var navigatorScale = 0.25;
      var navigator = null;

      function initCommonDefs(svgDefs) {

        svgDefs.append('clipPath')
          .attr('id', 'wrapperClipPath')
          .attr('class', 'wrapper clipPath')
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
      }

      var lastScale = 1;

      function zoomHandler() {
        var translation = [0,0];

        if (d3.event.scale === lastScale) {
          var halfWidth = graphElements[0][0].getBBox().width / 2 * 0.5;
          var halfHeight = graphElements[0][0].getBBox().height / 2 * 0.5;

          var newX = caculcateDragLimit(d3.event.translate[0], halfWidth, 0, width);
          var newY = caculcateDragLimit(d3.event.translate[1], halfHeight, 0, height);

          translation = [newX, newY];

          console.log('lastscale: '+lastScale);

          var w = graphElements.node().getBBox().width * 0.5 * lastScale;
          var h = graphElements.node().getBBox().height * 0.5 * lastScale;

          console.log('w: '+ w +' h:'+h);

//          console.log('sourceEvent:'+[d3.event.sourceEvent.x, d3.event.sourceEvent.y]);
//
//          console.log('halfsides: '+[halfWidth,halfHeight]);
//          console.log('original point: ('+d3.event.translate[0]+','+d3.event.translate[1]+')new point:('+translation+')');
        }

        lastScale = d3.event.scale;

        panCanvas.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
      }

      var zoom = d3.behavior.zoom().scaleExtent([1, 8]).on('zoom.canvas', zoomHandler);

      var svg = this.svg = d3.select(container).
        append('svg').attr('class','canvas').
        attr('width', width + navigatorPadding * 2 + (width*navigatorScale)).
        attr('height', height);

      svg.append('rect')
        .attr('id', 'clipPathRect')
        .attr('width', width)
        .attr('height', height)
        .attr('stroke', '#111111')
        .attr('fill', 'none');

      var clipPath = svg.append('g').attr('clip-path', 'url(#wrapperClipPath)');

      var panCanvas = this.panCanvas = clipPath.append('g')
        .call(zoom)
        .append('g')
        .attr('id','panCanvas')
        .attr('transform', 'translate(0,0)');

      this.graphContainer = panCanvas.append('g').attr('id','graphContainer').attr('transform', 'scale(0.5)');

      this.graphContainer.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height);

      var graphElements = this.graphElements = this.graphContainer.append('g').attr('id','graphElements');

      navigator = this.navigator = new Navigator()
        .zoom(zoom)
        .target(d3.select(container).select('.canvas'))
        .navigatorScale(navigatorScale)
        .navigatorPadding(navigatorPadding)
        .x(width + navigatorPadding)
        .y(navigatorPadding);

      svg.call(navigator);
      navigator.render();

      var defs = svg.append('defs');

      initCommonDefs(defs);

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