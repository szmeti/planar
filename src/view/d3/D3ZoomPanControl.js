/* global D3ZoomPanControl: true */
var D3ZoomPanControl = (function() {

  function D3ZoomPanControl(container, zoom, target, settings) {
    this.base = container;
    this.width = settings.width;
    this.height = settings.height;
    this.zoom = zoom;
    this.target = target;
    this.zoomScale = settings.zoomPanControl.zoomStep;
    this.panScale = settings.zoomPanControl.panStep;
    this.x = settings.zoomPanControl.paddingLeft;
    this.y = settings.zoomPanControl.paddingTop;
  }

  utils.mixin(D3ZoomPanControl.prototype, {
    render : function() {
      if (!settings.zoomPanControl.enabled) {
        return;
      }

      var container = this.base.append('g')
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

      container.attr('transform', 'translate(' + this.x + ',' + this.y + ')');

      var control = this;

      d3.select('#panUp').on('click', function() {
        doPan(control, {x: 0, y:control.panScale});
      });

      d3.select('#panDown').on('click', function() {
        doPan(control, {x: 0, y: -control.panScale});
      });
      d3.select('#panLeft').on('click', function() {
        doPan(control, {x: control.panScale, y: 0});
      });
      d3.select('#panRight').on('click', function() {
        doPan(control, {x: -control.panScale, y: 0});
      });

      d3.select('#zoomIn').on('click', function() {
        doZoom(control, control.zoomScale);
      });
      d3.select('#zoomOut').on('click', function() {
        doZoom(control, -control.zoomScale);
      });
    }
  });

  function doZoom(context,  newScaleStep) {
    var targetTransform = SvgUtils.getXYFromTranslate(context.target.attr('transform'));

    var scale = context.zoom.scale();
    var newScale = scale + newScaleStep;

    var originalCanvas = { w: context.width * scale, h: context.height * scale};
    var newCanvas = { w: context.width * newScale, h: context.height * newScale};
    var xScale = (originalCanvas.w - newCanvas.w) / 2;
    var yScale = (originalCanvas.h - newCanvas.h) / 2;
    var newTransform = [xScale + targetTransform[0], yScale + targetTransform[1]];

    newScale = Math.min(context.zoom.scaleExtent()[1], Math.max(context.zoom.scaleExtent()[0], newScale));

    var topBound = -context.height * newScale + context.height,
      bottomBound = 0,
      leftBound = -context.width * newScale + context.width,
      rightBound = 0;

    var translation = [
      Math.max(Math.min(newTransform[0], rightBound), leftBound),
      Math.max(Math.min(newTransform[1], bottomBound), topBound)
    ];

    context.target.attr('transform', 'translate('+ translation +')scale(' + newScale + ')');
    context.zoom.translate(translation).scale(newScale);
  }

  function doPan(context, translation) {
    var scale = context.zoom.scale();
    var topBound = -context.height * scale + context.height,
      bottomBound = 0,
      leftBound = -context.width * scale + context.width,
      rightBound = 0;

    var targetTransform = SvgUtils.getXYFromTranslate(context.target.attr('transform'));

    var frameX = targetTransform[0];
    var frameY = targetTransform[1];

    frameX += translation.x;
    frameY += translation.y;

    frameX = Math.max(Math.min(frameX, rightBound), leftBound);
    frameY = Math.max(Math.min(frameY, bottomBound), topBound);

    context.target.attr('transform', 'translate(' + [frameX, frameY] + ')scale(' + scale + ')');
    context.zoom.translate([frameX, frameY]);
  }

  return D3ZoomPanControl;
})();