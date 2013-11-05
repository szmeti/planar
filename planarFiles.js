planarFiles = {
  'planarSrc': [
    'src/version.js',
    'src/utils.js',
    'src/constants.js',
    'src/model/Element.js',
    'src/model/Edge.js',
    'src/model/Vertex.js',
    'src/model/Graph.js',
    'src/query/LabelFilter.js',
    'src/query/Query.js',
    'src/query/VertexQuery.js'
  ],

  'planarApi': [
    'src/exportApi.js'
  ],

  'planarDist': [
    '@planarSrc',
    '@planarApi'
  ],

  'planarUnitTests': [
    'test/spec/{,*/}*.js'
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