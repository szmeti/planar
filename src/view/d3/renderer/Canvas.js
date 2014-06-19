/* global Canvas: true */
var Canvas = function() {

  'use strict';

  var width           = 500,
    height          = 500,
    zoomEnabled     = true,
    dragEnabled     = true,
    scale           = 1,
    translation     = [0,0],
    base            = null,
    wrapperBorder   = 2,
    navigator         = null,
    navigatorPadding  = 20,
    navigatorScale    = 0.25;

  function Canvas(selection) {

    base = selection;

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
        var tbound = -height * scale,
          bbound = height  * scale,
          lbound = -width  * scale,
          rbound = width   * scale;
        // limit translation to thresholds
        translation = d3.event ? d3.event.translate : [0, 0];
        translation = [
          Math.max(Math.min(translation[0], rbound), lbound),
          Math.max(Math.min(translation[1], bbound), tbound)
        ];
      }

//      scale = Math.max(scale, 1);

      d3.select('.panCanvas, .panCanvas .bg')
        .attr('transform', 'translate(' + translation + ')' + ' scale(' + scale + ')');

      navigator.scale(scale).render();
    }; // startoff zoomed in a bit to show pan/zoom rectangle

    var zoom = d3.behavior.zoom()
      .x(xScale)
      .y(yScale)
      .scaleExtent([0.5, 5])
      .on('zoom.canvas', zoomHandler);

    var svg = selection.append('svg')
      .attr('class', 'svg canvas')
      .attr('width',  width  + (wrapperBorder*2) + navigatorPadding*2 + (width*navigatorScale))
      .attr('height', height + (wrapperBorder*2) + navigatorPadding*2)
      .attr('shape-rendering', 'auto');

    var svgDefs = svg.append('defs');

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
      //.attr('transform', 'translate(' + (width + navigatorPadding) + ',' + (navigatorPadding/2) + ')')
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
      .attr('class', 'panCanvas')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(0,0)');

    panCanvas.append('rect')
      .attr('class', 'background')
      .attr('width', width)
      .attr('height', height);

    navigator = new Navigator()
      .zoom(zoom)
      .target(panCanvas)
      .navigatorScale(navigatorScale)
      .x(width + navigatorPadding)
      .y(navigatorPadding);

    svg.call(navigator);

//    // startoff zoomed in a bit to show pan/zoom rectangle
    zoom.scale(0.75);
    zoomHandler(0.75);

    /** ADD SHAPE **/
    Canvas.addItem = function(item) {
      panCanvas.node().appendChild(item.node());
      navigator.render();
    };

    /** RENDER **/
    Canvas.render = function() {
      svgDefs
        .select('.clipPath .background')
        .attr('width', width)
        .attr('height', height);

      svg
        .attr('width',  width  + (wrapperBorder*2) + navigatorPadding*2 + (width*navigatorScale))
        .attr('height', height + (wrapperBorder*2));

      outerWrapper
        .select('.background')
        .attr('width', width + wrapperBorder*2)
        .attr('height', height + wrapperBorder*2);

      innerWrapper
        .attr('transform', 'translate(' + (wrapperBorder) + ',' + (wrapperBorder) + ')')
        .select('.background')
        .attr('width', width)
        .attr('height', height);

      panCanvas
        .attr('width', width)
        .attr('height', height)
        .select('.background')
        .attr('width', width)
        .attr('height', height);

      navigator
        .x(width + navigatorPadding)
        .y(navigatorPadding)
        .render();
    };

    Canvas.zoomEnabled = function(isEnabled) {
      if (!arguments.length) {
        return settings.d3.zoomEnabled;
      }
      zoomEnabled = isEnabled;
    };

    Canvas.dragEnabled = function(isEnabled) {
      if (!arguments.length) {
        return settings.d3.dragEnabled;
      }
      dragEnabled = isEnabled;
    };

//    Canvas.reset = function() {
//      d3.transition().duration(750).tween('zoom', function() {
//        var ix = d3.interpolate(xScale.domain(), [-width  / 2, width  / 2]),
//          iy = d3.interpolate(yScale.domain(), [-height / 2, height / 2]),
//          iz = d3.interpolate(scale, 1);
//        return function(t) {
//          zoom.scale(iz(t)).x(x.domain(ix(t))).y(y.domain(iy(t)));
//          zoomed(iz(t));
//        };
//      });
//    };
  }


  //============================================================
  // Accessors
  //============================================================


  Canvas.width = function(value) {
    if (!arguments.length) {
      return width;
    }
    width = parseInt(value, 10);
    return this;
  };

  Canvas.height = function(value) {
    if (!arguments.length) {
      return height;
    }
    height = parseInt(value, 10);
    return this;
  };

  Canvas.scale = function(value) {
    if (!arguments.length) {
      return scale;
    }
    scale = value;
    return this;
  };

  return Canvas;
};