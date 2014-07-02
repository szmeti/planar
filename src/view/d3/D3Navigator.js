/* global D3Navigator: true */
var D3Navigator = (function() {

  function D3Navigator(selection, zoom, target, settings, graph) {
    this.navigatorScale = settings.navigator.scale;
    this.scale = 1;
    this.zoom = zoom;
    this.target = target;
    this.width = settings.width;
    this.height = settings.height;
    this.frameX = 0;
    this.frameY = 0;
    this.renderNavigator = true;
    this.graph = graph;

    if (!shouldShowNavigator()) {
      D3Navigator.render = function () {};
      return;
    }

    initDefs(selection, this.width, this.height);

    this.base = selection;

    this.container = this.base.append('g')
      .attr('class', 'navigator')
      .attr('clip-path', 'url(#navigatorClipPath)')
      .call(this.zoom);

    var navigatorClipPath = this.container.append('g');

    var navigator = this;

    this.zoom.on('zoom.navigator', function() {
      navigator.scale = d3.event.scale;
    });

    D3Navigator.node = navigatorClipPath.node();

    this.frame = navigatorClipPath.append('g')
      .attr('class', 'frame');

    this.frame.append('rect')
      .attr('class', 'background')
      .attr('width', this.width)
      .attr('height', this.height);

    var navigatorDrag = d3.behavior.drag()
      .on('dragstart.navigator', function() {
        onDragstart(navigator);
      })
      .on('drag.navigator', function() {
        onDrag(navigator);
      });

    this.frame.call(navigatorDrag);

    graph.on('graphUpdated', function() {
      reDraw(navigator);
    });

    graph.on('vertexDrag', function() {
      reDraw(navigator);
    });

  }

  utils.mixin(D3Navigator.prototype, {

    /** RENDER **/
    render : function() {
      var targetTransform = SvgUtils.getXYFromTranslate(this.target.attr('transform'));
      this.frame.attr('transform', 'translate(' + (-targetTransform[0]/this.scale) + ',' + (-targetTransform[1]/this.scale) + ')')
        .select('.background')
        .attr('width', this.width/this.scale)
        .attr('height', this.height/this.scale);

      if (!this.renderNavigator) {
        return;
      }

      this.scale = this.zoom.scale();
      this.container.attr('transform', 'scale(' + this.navigatorScale + ')');
      var node = this.target.node().cloneNode(true);
      node.removeAttribute('id');
      d3.selectAll('.navigator .panCanvas').remove();
      this.base.selectAll('.navigator .canvas').remove();
      D3Navigator.node.appendChild(node);
      this.frame.node().parentNode.appendChild(this.frame.node());
      d3.select(node).attr('transform', 'translate(1,1)');
      this.renderNavigator = false;
    }
  });

  function reDraw(navigator) {
    navigator.renderNavigator = true;
    navigator.render();
  }

  function shouldShowNavigator() {
    return settings.zoom.enabled && settings.navigator.enabled;
  }

  function onDragstart(navigator) {
    var frameTranslate = SvgUtils.getXYFromTranslate(navigator.frame.attr('transform'));
    navigator.frameX = parseInt(frameTranslate[0],10);
    navigator.frameY = parseInt(frameTranslate[1],10);
  }

  function onDrag(navigator) {
    var topBound = 0,
      bottomBound = navigator.height - navigator.height / navigator.scale,
      leftBound = 0,
      rightBound = navigator.width - navigator.width / navigator.scale;

    d3.event.sourceEvent.stopImmediatePropagation();
    navigator.frameX += d3.event.dx;
    navigator.frameY += d3.event.dy;

    navigator.frameX = Math.max(Math.min(navigator.frameX, rightBound), leftBound);
    navigator.frameY = Math.max(Math.min(navigator.frameY, bottomBound), topBound);

    navigator.frame.attr('transform', 'translate(' + navigator.frameX + ',' + navigator.frameY + ')');

    var translate =  [(-navigator.frameX * navigator.scale),(-navigator.frameY * navigator.scale)];
    navigator.target.attr('transform', 'translate(' + translate + ')scale(' + navigator.scale + ')');
    navigator.zoom.translate(translate);
  }

  function initDefs(svg, width, height) {
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
  }

  return D3Navigator;

}());