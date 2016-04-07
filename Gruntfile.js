module.exports = function(grunt) {
  'use strict';
  require("load-grunt-tasks")(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      all: {
        files: [
          'Gruntfile.js',
          'src/bwch.js',
          'example/js/src/test-bw.js'
        ],
        tasks: ['shell:jshint']
      }
    },
    shell: {
      jshint: {
        command: 'jshint src/. Gruntfile.js example/js/src/. test/spec/src/.'
      },
      browserify: {
        command: 'browserify example/js/src/test-bw.js -o example/js/dist/test-bw.js -t [ babelify --presets [ es2015 ] ] -v'
      },
      browserifyTest: {
        command: 'browserify test/spec/src/bwch.spec.js -o test/spec/dist/bwch.spec.js -t [ babelify --presets [ es2015 ] ] -v'
      },
      watchify: {
        command: 'watchify example/js/src/test-bw.js -o example/js/dist/test-bw.js -t [ babelify --presets [ es2015 ] ] -v'
      },
      watchifyTest: {
        command: 'watchify test/spec/src/bwch.spec.js -o test/spec/dist/bwch.spec.js -t [ babelify --presets [ es2015 ] ] -v'
      }
    },
    concurrent: {
      prod: {
        tasks: ['shell:browserify', 'shell:browserifyTest'],
        options: {
          logConcurrentOutput: true
        }
      },
      dev: {
        tasks: ['shell:watchify', 'shell:watchifyTest'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });
  // Default task(s).
  grunt.registerTask('dev', [
    'concurrent:dev'
  ]);
  grunt.registerTask('default', [
    'shell:jshint',
    'concurrent:prod'
  ]);
};