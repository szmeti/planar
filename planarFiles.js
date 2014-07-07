planarFiles = {
  'planarSrc': [
    'src/version.js',
    'src/utils/utils.js',
    'src/utils/GeometryUtils.js',
    'src/utils/SvgUtils.js',
    'src/constants.js',
    'src/event/EventEmitter.js',
    'src/model/Point.js',
    'src/model/Rectangle.js',
    'src/model/Element.js',
    'src/model/Edge.js',
    'src/model/Vertex.js',
    'src/model/Graph.js',
    'src/model/filter/InternalPropertyFilter.js',
    'src/index/Index.js',
    'src/index/IndexManager.js',
    'src/query/LabelFilter.js',
    'src/query/Compare.js',
    'src/query/Contains.js',
    'src/query/HasFilter.js',
    'src/query/Query.js',
    'src/query/VertexQuery.js',
    'src/query/GraphQuery.js',
    'src/view/Timer.js',
    'src/view/BoundingBoxCalculator.js',
    'src/view/layout/RandomLayout.js',
    'src/view/layout/ForceDirectedLayout.js',
    'src/view/GraphDecorator.js',
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
    'src/view/Renderer.js',
    'src/io/GraphSONReader.js',
    'src/settings.js'
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