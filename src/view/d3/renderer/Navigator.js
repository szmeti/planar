/* global Navigator: true */
var Navigator = function() {

  'use strict';

  var navigatorScale = 0.15,
    scale           = 1,
    zoom            = null,
    base            = null,
    target          = null,
    width           = 0,
    height          = 0,
    x               = 0,
    y               = 0,
    navigatorPadding= 0,
    frameX          = 0,
    frameY          = 0;

  function Navigator(selection) {

    base = selection;

    var container = selection.append('g')
      .attr('class', 'navigator')
      .call(zoom);

    container.append('rect')
      .attr('class', 'background')
      .attr('width', (width - (width + navigatorPadding*2)*navigatorScale))
      .attr('height', height)
      .attr('stroke', '#111111');

    var navigatorClipPath = container.append('g')
      .attr('width', width)
      .attr('height', height)
      .attr('clip-path', 'url(#wrapperClipPath)');

    var panCanvas = d3.select('#panCanvas');

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
        frameX = parseInt(frameTranslate[0], 10);
        frameY = parseInt(frameTranslate[1], 10);
      })
      .on('drag.navigator', function() {
        d3.event.sourceEvent.stopImmediatePropagation();
        frameX += d3.event.dx;
        frameY += d3.event.dy;
        frame.attr('transform', 'translate(' + frameX + ',' + frameY + ')');
        var translate =  [(-frameX*scale),(-frameY*scale)];
        panCanvas.attr('transform', 'translate(' + translate + ')scale(' + scale + ')');
        zoom.translate(translate);
      });

    frame.call(drag);

    /** RENDER **/
    Navigator.render = function() {
      scale = zoom.scale();
      var panCanvas = d3.select('#panCanvas');
      //due to frequent rendering the earlier appended frames must be removed
      d3.selectAll('.navigator-graph').remove();

      container.attr('transform', 'translate(' + x + ',' + y + ')scale(' + navigatorScale + ')');

      var node = panCanvas.node().cloneNode(true);
      node.removeAttribute('id');
      base.selectAll('.navigator .canvas').remove();
      Navigator.node.appendChild(node);

      var targetTransform = SvgUtils.getXYFromTranslate(panCanvas.attr('transform'));
      frame.attr('transform', 'translate(' + (-targetTransform[0]/scale) + ',' + (-targetTransform[1]/scale) + ')')
        .select('.background')
        .attr('width', (width - width*navigatorScale)/scale)
        .attr('height', height/scale);
      frame.node().parentNode.appendChild(frame.node());
      d3.select(node).attr('class', 'navigator-graph').attr('transform', 'translate(1,1)');
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

  Navigator.navigatorPadding = function(value) {
    if (!arguments.length) {
      return navigatorPadding;
    }
    navigatorPadding = parseInt(value, 10);
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