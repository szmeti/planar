planarFiles = {
  'planarSrc': [
    'src/version.js',
    'src/utils/utils.js',
    'src/utils/GeometryUtils.js',
    'src/utils/SvgUtils.js',
    'src/utils/DomUtils.js',
    'src/constants.js',
    'src/event/EventEmitter.js',
    'src/model/Point.js',
    'src/model/Rectangle.js',
    'src/model/Element.js',
    'src/model/Edge.js',
    'src/model/Vertex.js',
    'src/model/Graph.js',
    'src/search/filter/property/InternalPropertyFilter.js',
    'src/index/Index.js',
    'src/index/IndexManager.js',
    'src/search/HasCondition.js',
    'src/search/LabelCondition.js',
    'src/search/HasConditions.js',
    'src/search/Compare.js',
    'src/search/Contains.js',
    'src/search/query/Query.js',
    'src/search/query/VertexQuery.js',
    'src/search/query/GraphQuery.js',
    'src/view/Timer.js',
    'src/view/BoundingBoxCalculator.js',
    'src/view/layout/RandomLayout.js',
    'src/view/layout/ForceDirectedLayout.js',
    'src/view/ElementRendererDecorator.js',
    'src/view/d3/decorator/{,*/}*.js',
    'src/view/Engine.js',
    'src/view/d3/D3SvgImageDownloader.js',
    'src/view/d3/D3ZoomPanManager.js',
    'src/view/d3/D3VertexManager.js',
    'src/view/d3/D3Navigator.js',
    'src/view/d3/D3ZoomPanControl.js',
    'src/view/d3/D3Engine.js',
    'src/view/d3/renderer/{,*/}*.js',
    'src/view/raphael/RaphaelEngine.js',
    'src/view/raphael/RaphaelRectangleVertexRenderer.js',
    'src/view/ElementRendererProvider.js',
    'src/view/Tween.js',
    'src/view/layout/CircleLayout.js',
    'src/view/layout/WheelLayout.js',
    'src/view/layout/GridLayout.js',
    'src/view/layout/NodeLinkTreeLayout.js',
    'src/view/layout/LayoutUtils.js',
    'src/view/Easing.js',
    'src/view/Renderer.js',
    'src/io/GraphSONReader.js',
    'src/settings.js',
    'src/search/filter/element/ElementFilterManager.js',
    'src/search/filter/element/ElementFilter.js'
  ],

  'planarApi': [
    'src/exportApi.js'
  ],

  'planarDist': [
    '@planarSrc',
    '@planarApi'
  ],

  'planarUnitTests': [
    'test/spec/**/*.js'
  ],

  'liveReload': [
    '.tmp/{,*/}*.js',
    '@planarSrc'
  ],

  'karmaUnit': [
    'node_modules/grunt-karma/node_modules/karma/adapter/lib/jasmine.js',
    'node_modules/grunt-karma/node_modules/karma/adapter/jasmine.js',
    '@planarSrc',
    '@planarUnitTests'
  ]
};

if (exports) {
  exports.files = planarFiles;
  exports.mergeFilesFor = function () {
    var files = [];

    Array.prototype.slice.call(arguments, 0).forEach(function (filegroup) {
      planarFiles[filegroup].forEach(function (file) {
        // replace @ref
        var match = file.match(/^\@(.*)/);
        if (match) {
          files = files.concat(planarFiles[match[1]]);
        } else {
          files.push(file);
        }
      });
    });

    return files;
  };
}