/* global ZoomPanControl: true */
var ZoomPanControl = function() {

  'use strict';

  var navigatorScale    = 0.15,
    base            = null,
    width           = 0,
    height          = 0,
    zoom            = null,
    target          = null,
    zoomScale       = 0.25,
    panScale        = 50,
    x               = 0,
    y               = 0;

  function ZoomPanControl(selection) {

    base = selection;

    function panUp(event) {
      doPan(0,panScale);
    }

    function panDown(event) {
      doPan(0,-panScale);
    }

    function panLeft(event) {
      doPan(panScale,0);
    }

    function panRight(event) {
      doPan(-panScale,0);
    }

    function zoomIn(event) {
      doZoom(zoomScale);
    }

    function zoomOut(event) {
      doZoom(-zoomScale);
    }

    function doZoom(newScaleStep) {
      var targetTransform = SvgUtils.getXYFromTranslate(target.attr('transform'));

      var scale = zoom.scale();
      var newScale = scale + newScaleStep;

      var originalCanvas = { w: width * scale, h: height * scale};
      var newCanvas = { w: width * newScale, h: height * newScale};
      var xScale = (originalCanvas.w - newCanvas.w) / 2;
      var yScale = (originalCanvas.h - newCanvas.h) / 2;
      var newTransform = [xScale + targetTransform[0], yScale + targetTransform[1]];

      newScale = Math.min(zoom.scaleExtent()[1], Math.max(zoom.scaleExtent()[0], newScale));

      var tbound = -height * newScale + height,
        bbound = 0,
        lbound = -width * newScale + width,
        rbound = 0;

      var translation = [
        Math.max(Math.min(newTransform[0], rbound), lbound),
        Math.max(Math.min(newTransform[1], bbound), tbound)
      ];

      target.attr('transform', 'translate('+ translation +')scale(' + newScale + ')');
      zoom.translate(translation).scale(newScale);
    }

    function doPan(x,y) {
      var scale = zoom.scale();
      var tbound = -height * scale + height,
        bbound = 0,
        lbound = -width * scale + width,
        rbound = 0;

      var targetTransform = SvgUtils.getXYFromTranslate(target.attr('transform'));

      var frameX = targetTransform[0];
      var frameY = targetTransform[1];

      frameX += x;
      frameY += y;

      frameX = Math.max(Math.min(frameX, rbound), lbound);
      frameY = Math.max(Math.min(frameY, bbound), tbound);

      target.attr('transform', 'translate(' + [frameX, frameY] + ')scale(' + scale + ')');
      zoom.translate([frameX, frameY]);
    }

    ZoomPanControl.render = function() {
      if (!settings.zoomPanControl.enabled) {
        return;
      }

      var container = selection.append('g')
        .attr('id','zoomPanControl');

      container.append('circle')
        .attr('class','wrapperCircle').attr('cx', 50).attr('cy', 50).attr('r', 42);

      container.append('path')
        .attr('id', 'panUp')
        .attr('class','zoomPanButton').attr('d','M50 10 l12   20 a40, 70 0 0,0 -24,  0z');

      container.append('path')
        .attr('id', 'panLeft')
        .attr('class','zoomPanButton').attr('d','M10 50 l20  -12 a70, 40 0 0,0   0, 24z');

      container.append('path')
        .attr('id', 'panDown')
        .attr('class','zoomPanButton').attr('d','M50 90 l12  -20 a40, 70 0 0,1 -24,  0z');

      container.append('path')
        .attr('id', 'panRight')
        .attr('class','zoomPanButton').attr('d','M90 50 l-20 -12 a70, 40 0 0,1   0, 24z');

      container.append('circle')
        .attr('class','compass').attr('cx', 50).attr('cy', 50).attr('r', 20);

      container.append('circle')
        .attr('id','zoomOut')
        .attr('class','zoomPanButton').attr('cx', 50).attr('cy', 41).attr('r', 8);

      container.append('circle')
        .attr('id','zoomIn')
        .attr('class','zoomPanButton').attr('cx', 50).attr('cy', 59).attr('r', 8);

      container.append('rect')
        .attr('class','plus-minus').attr('x', 46).attr('y', 39.5).attr('width', 8).attr('height', 3);

      container.append('rect')
        .attr('class','plus-minus').attr('x', 46).attr('y', 57.5).attr('width', 8).attr('height', 3);

      container.append('rect')
        .attr('class','plus-minus').attr('x', 48.5).attr('y', 55).attr('width', 3).attr('height', 8);

      container.attr('transform', 'translate(' + x + ',' + y + ')');

      d3.select('#panUp').on('click', panUp);
      d3.select('#panDown').on('click', panDown);
      d3.select('#panLeft').on('click', panLeft);
      d3.select('#panRight').on('click', panRight);

      d3.select('#zoomIn').on('click', zoomIn);
      d3.select('#zoomOut').on('click', zoomOut);
    };
  }

  ZoomPanControl.width = function(value) {
    if (!arguments.length) {
      return width;
    }
    width = parseInt(value, 10);
    return this;
  };

  ZoomPanControl.height = function(value) {
    if (!arguments.length) {
      return height;
    }
    height = parseInt(value, 10);
    return this;
  };

  ZoomPanControl.x = function(value) {
    if (!arguments.length) {
      return x;
    }
    x = parseInt(value, 10);
    return this;
  };

  ZoomPanControl.y = function(value) {
    if (!arguments.length) {
      return y;
    }
    y = parseInt(value, 10);
    return this;
  };

  ZoomPanControl.panScale = function(value) {
    if (!arguments.length) {
      return panScale;
    }
    panScale = value;
    return this;
  };

  ZoomPanControl.zoomScale = function(value) {
    if (!arguments.length) {
      return zoomScale;
    }
    zoomScale = value;
    return this;
  };

  ZoomPanControl.target = function(value) {
    if (!arguments.length) {
      return target;
    }
    target = value;
    width  = parseInt(target.attr('width'),  10);
    height = parseInt(target.attr('height'), 10);
    return this;
  };

  ZoomPanControl.zoom = function(value) {
    if (!arguments.length) {
      return zoom;
    }
    zoom = value;
    return this;
  };

  return ZoomPanControl;
};