/* global D3ZoomPanManager: true */
var D3ZoomPanManager = (function () {

  function D3ZoomPanManager(container, defs, settings, graph) {
    this.scale = settings.zoom.defaultScale;
    this.translation = [0, 0];
    this.xScale = getXScale(settings);
    this.yScale = getYScale(settings);
    this.svg = container;
    this.svgDefs = defs;
    this.zoom = null;
    this.navigator = null;
    this.graphContainer = null;
    this.settings = settings;
    this.graph = graph;
  }

  utils.mixin(D3ZoomPanManager.prototype, {
    init: function () {
      var context = this;

      var zoomCallback = (function () {
        var settings = context.settings;

        return function (newScale) {
          if (!settings.zoom.enabled) {
            return;
          }
          if (d3.event) {
            context.scale = d3.event.scale;
          } else {
            context.scale = newScale;
          }
          if (settings.drag.enabled) {
            var topBound = -settings.height * context.scale + settings.height,
              bottomBound = 0,
              leftBound = -settings.width * context.scale + settings.width,
              rightBound = 0;
            // limit newTranslation to thresholds
            var newTranslation = d3.event && context.scale !== 1 ? d3.event.translate : [0, 0];
            context.translation = [
              Math.max(Math.min(newTranslation[0], rightBound), leftBound),
              Math.max(Math.min(newTranslation[1], bottomBound), topBound)
            ];
          }

          d3.select('.panCanvas, .panCanvas .bg')
            .attr('transform', 'translate(' + context.translation + ')' + ' scale(' + context.scale + ')');
        };
      })();

      this.zoom = d3.behavior.zoom()
        .x(this.xScale)
        .y(this.yScale)
        .scaleExtent([this.settings.zoom.minScale, this.settings.zoom.maxScale])
        .on('zoom.canvas', zoomCallback);

      initCommonDefs(this);

      this.navigator = initNavigator(this.zoom, this.settings, this.graph);
      initZoomPanControl(this.svg, this.zoom, this.settings, this.graph);
    },

    getZoom: function() {
      return this.zoom;
    },

    getNavigator: function () {
      return this.navigator;
    },

    getGraphContainer: function () {
      return this.graphContainer;
    }
  });

  function getXScale(settings) {
    return d3.scale.linear()
      .domain([-settings.width / 2, settings.width / 2])
      .range([0, settings.width]);
  }

  function getYScale(settings) {
    return d3.scale.linear()
      .domain([-settings.height / 2, settings.height / 2])
      .range([settings.height, 0]);
  }

  function initNavigator(zoom, settings, graph) {
    if (!utils.exists(settings.navigatorContainer) || !settings.navigator.enabled) {
      return null;
    }

    var navigatorSvg = d3.select(settings.navigatorContainer)
      .append('svg')
      .attr('width', settings.width * settings.navigator.scale)
      .attr('height', settings.height * settings.navigator.scale)
      .attr('class', 'svg canvas');

    return new D3Navigator(navigatorSvg, zoom, d3.select('#panCanvas'), settings, graph);
  }

  function initZoomPanControl(container, zoom, settings, graph) {
    var zoomPanControl = new D3ZoomPanControl(container, zoom, d3.select('#panCanvas'), settings, graph);
    zoomPanControl.render();
  }

  function initCommonDefs(context) {
    context.svgDefs.append('clipPath')
      .attr('id', 'wrapperClipPath')
      .attr('class', 'wrapper clipPath')
      .append('rect')
      .attr('class', 'background')
      .attr('width', context.settings.width)
      .attr('height', context.settings.height);

    var outerWrapper = context.svg.append('g')
      .attr('id', 'outerWrapper')
      .attr('class', 'wrapper outer');

    outerWrapper.append('rect')
      .attr('class', 'background')
      .attr('width', context.settings.width)
      .attr('height', context.settings.height);

    var innerWrapper = outerWrapper.append('g')
      .attr('class', 'wrapper inner')
      .attr('clip-path', 'url(#wrapperClipPath)')
      .call(context.zoom);

    innerWrapper.append('rect')
      .attr('class', 'background')
      .attr('width', context.settings.width)
      .attr('height', context.settings.height);

    var panCanvas = innerWrapper.append('g')
      .attr('id', 'panCanvas')
      .attr('class', 'panCanvas')
      .attr('width', context.settings.width)
      .attr('height', context.settings.height)
      .attr('transform', 'translate(0,0)');

    panCanvas.append('rect')
      .attr('class', 'background')
      .attr('width', context.settings.width)
      .attr('height', context.settings.height);

    context.graphContainer = panCanvas.append('g')
      .attr('id', 'graphElements')
      .attr('transform', 'scale(' + context.scale + ')');
  }

  return D3ZoomPanManager;

}());