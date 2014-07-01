/* global Navigator: true */
var Navigator = function() {

  'use strict';

  var navigatorScale    = 0.15,
    scale           = 1,
    zoom            = null,
    base            = null,
    target          = null,
    width           = 0,
    height          = 0,
    x               = 0,
    y               = 0,
    frameX          = 0,
    frameY          = 0;

  function shouldShowNavigator() {
    return settings.zoom.enabled && settings.navigator.enabled;
  }

  function initDefs(svg) {
    var svgDefs = svg.append('defs');
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
  }

  function Navigator(selection) {
    if (!shouldShowNavigator()) {
      Navigator.render = function () {
        return;
      };
      return;
    }

    initDefs(selection);

    base = selection;

    var container = selection.append('g')
      .attr('class', 'navigator')
      .attr('clip-path', 'url(#navigatorClipPath)')
      .call(zoom);

    var navigatorClipPath = container.append('g');

    zoom.on('zoom.navigator', function() {
      scale = d3.event.scale;
    });

    Navigator.node = navigatorClipPath.node();

    var frame = navigatorClipPath.append('g')
      .attr('class', 'frame');

    frame.append('rect')
      .attr('class', 'background')
      .attr('width', width)
      .attr('height', height)
      .attr('filter', 'url(#navigatorDropShadow)');

    var drag = d3.behavior.drag()
      .on('dragstart.navigator', function() {
        var frameTranslate = SvgUtils.getXYFromTranslate(frame.attr('transform'));
        frameX = parseInt(frameTranslate[0],10);
        frameY = parseInt(frameTranslate[1],10);
      })
      .on('drag.navigator', function() {
        var tbound = 0,
          bbound = height - height / scale,
          lbound = 0,
          rbound = width - width / scale;

        d3.event.sourceEvent.stopImmediatePropagation();
        frameX += d3.event.dx;
        frameY += d3.event.dy;

        frameX = Math.max(Math.min(frameX, rbound), lbound);
        frameY = Math.max(Math.min(frameY, bbound), tbound);

        frame.attr('transform', 'translate(' + frameX + ',' + frameY + ')');

        var translate =  [(-frameX*scale),(-frameY*scale)];
        target.attr('transform', 'translate(' + translate + ')scale(' + scale + ')');
        zoom.translate(translate);
      });

    frame.call(drag);

    /** RENDER **/
    Navigator.render = function() {
      scale = zoom.scale();
      container.attr('transform', 'translate(' + x + ',' + y + ')scale(' + navigatorScale + ')');
      var node = target.node().cloneNode(true);
      node.removeAttribute('id');
      d3.selectAll('.navigator .panCanvas').remove();
      base.selectAll('.navigator .canvas').remove();
      Navigator.node.appendChild(node);
      var targetTransform = SvgUtils.getXYFromTranslate(target.attr('transform'));
      frame.attr('transform', 'translate(' + (-targetTransform[0]/scale) + ',' + (-targetTransform[1]/scale) + ')')
        .select('.background')
        .attr('width', width/scale)
        .attr('height', height/scale);
      frame.node().parentNode.appendChild(frame.node());
      d3.select(node).attr('transform', 'translate(1,1)');
    };
  }

  Navigator.width = function(value) {
    if (!arguments.length) {
      return width;
    }
    width = parseInt(value, 10);
    return this;
  };

  Navigator.height = function(value) {
    if (!arguments.length) {
      return height;
    }
    height = parseInt(value, 10);
    return this;
  };

  Navigator.x = function(value) {
    if (!arguments.length) {
      return x;
    }
    x = parseInt(value, 10);
    return this;
  };

  Navigator.y = function(value) {
    if (!arguments.length) {
      return y;
    }
    y = parseInt(value, 10);
    return this;
  };

  Navigator.scale = function(value) {
    if (!arguments.length) {
      return scale;
    }
    scale = value;
    return this;
  };

  Navigator.navigatorScale = function(value) {
    if (!arguments.length) {
      return navigatorScale;
    }
    navigatorScale = value;
    return this;
  };

  Navigator.zoom = function(value) {
    if (!arguments.length) {
      return zoom;
    }
    zoom = value;
    return this;
  };

  Navigator.target = function(value) {
    if (!arguments.length) {
      return target;
    }
    target = value;
    width  = parseInt(target.attr('width'),  10);
    height = parseInt(target.attr('height'), 10);
    return this;
  };

  return Navigator;
};