var planarFiles = require('./planarFiles');
var files = planarFiles.files;

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    version: grunt.file.readJSON('package.json').version,

    // configurable paths
    planar: {
      src: 'src',
      dist: 'dist'
    },

    watch: {
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: planarFiles.mergeFilesFor('liveReload')
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp'
          ]
        }
      },
      test: {
        options: {
          base: [
            '.tmp',
            'test'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= planar.dist %>'
        }
      }
    },

    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= planar.dist %>/*.js'
            ]
          }
        ]
      },
      server: '.tmp'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: files.planarSrc,
      tests: files.planarUnitTests,
      gruntfile: ['Gruntfile.js']
    },

    uglify: {
      options: {
        wrap: 'planar'
      },
      js: {
        options: {
          mangle: false,
          beautify: true,
          compress: false
        },
        src: planarFiles.mergeFilesFor('planarDist'),
        dest: '<%= planar.dist %>/planar.js'
      },
      jsmin: {
        options: {
          mangle: true,
          compress: true
        },
        src: planarFiles.mergeFilesFor('planarDist'),
        dest: '<%= planar.dist %>/planar.min.js'
      }
    },

    sed: {
      version: {
        pattern: '%VERSION%',
        replacement: '<%= version %>',
        path: ['<%= uglify.js.dest %>', '<%= uglify.jsmin.dest %>']
      },
      strict: {
        pattern: '((!function|\\(function)\\([^)]*\\)\\s*\\{)',
        replacement: '$1\'use strict\';',
        path: ['<%= uglify.js.dest %>', '<%= uglify.jsmin.dest %>']
      }
    },

    karma: {
      options: {
        singleRun: true,
        frameworks: ['jasmine'],
        port: 8087,
        runnerPort: 9100,
        browsers: ['Chrome'],
        captureTimeout: 10000,
        basePath: __dirname
      },
      unit: {
        options: {
          files: planarFiles.mergeFilesFor('karmaUnit'),
          preprocessors: {
            '**/src/**/*.js': 'coverage'
          },
          reporters: ['progress', 'coverage']
        }
      },
      dev: {
        options: {
          autoWatch: true,
          singleRun: false,
          files: planarFiles.mergeFilesFor('karmaUnit')
        }
      },
      end2end: {
      },
      travis: {
        options: {
          browsers: ['PhantomJS'],
          files: planarFiles.mergeFilesFor('karmaUnit')
        }
      }
    }

  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    return grunt.task.run([
      'clean:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'uglify',
    'sed:version',
    'sed:strict'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('travis', [
    'jshint',
    'karma:travis'
  ]);
};
