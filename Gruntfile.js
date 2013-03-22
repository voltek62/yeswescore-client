module.exports = function (grunt) {
  // cordova version (used in cordova-2.4.0.js)
  var cordovaVersion = "2.4.0";

  // External tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-template-helper');
  grunt.loadNpmTasks('grunt-preprocess');

  grunt.loadTasks('grunt-tasks');

  // FIXME: should be a grunt task ?
  // reading index.html
  var fs = require('fs');
  var html = fs.readFileSync(__dirname + '/src/index.html');

  // FIXME: regexp are weak.
  // FIXME: regexp doesn't prevent including commented scripts !
  // harvesting javascripts: <script (...) src="..."></script>
  var re = /<script.*src="([^"]+)">/gi;
  var scripts = [], r;
  while ((r = re.exec(html)) !== null) {
    // excluding cordova file (to not be included twice)
    if (r[0].indexOf("data-grunt-included=\"false\"") == -1)
      scripts.push('src/' + r[1]); // ex: src/js/main.js
  }

  // harvesting css: <link (...) href="styles/main.css"></link>
  var css = [];
  re = /<link.*href="([^"]+)">/gi;
  while ((r = re.exec(html)) !== null) {
    // excluding cordova file (to not be included twice)
    if (r[0].indexOf("data-grunt-included=\"false\"") == -1)
      css.push('src/' + r[1]); // ex: src/styles/main.css
  }

  //
  // Project configuration
  //
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*\n'
        + ' * <%= pkg.name %> v<%= pkg.version %>\n'
        + ' *\n'
        + ' * Copyright (c) <%= grunt.template.today("yyyy") %> zeNodus'
        + ' *\n'
        + ' * Date: <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>\n'
        + ' */'
    },
    jshint: { all: [ /* FIXME */] },
    /* FIXME: wtf is this plugin ??? */
    template: {
      dev: {
        options: {
          wrap: {
            banner: '<script type="text/template" id="#{0}">',
            footer: '</script>',
            inject: [{
              prop: 'src',
              rem: 'src/templates/',
              repl: { ".html": "" }
            }]
          }
        },
        src: ['src/templates/*.html'],
        dest: 'dist/templates.html'
      }
    },
    concat: {
      dist_javascript: {
        src: scripts,
        dest: 'dist/app.js'
      },
      dist_css: {
        src: css,
        dest: 'dist/app.css'
      },
      dist_html: {
        src: ['src/index.html'],
        dest: 'dist/index.html'
      }
    },
	copy: {
	  images: {
		files: [
		  {expand: true, flatten: true, src: ['src/images/*'], dest: 'platforms/android/assets/www/images/',filter: 'isFile'},
		  {expand: true, flatten: true, src: ['src/images/*'], dest: 'platforms/ios/build/images/',filter: 'isFile'},
		  {expand: true, flatten: true, src: ['src/images/*'], dest: 'platforms/wp8/build/images/',filter: 'isFile'}
		]
	  }
	},	  
    uglify: {
      build: {
        src: 'dist/app.js',
        dest: 'dist/app.min.js'
      }
    },
    cssmin: {
      my_target: {
        src: 'dist/app.css',
        dest: 'dist/app.min.css'
      }
    },
    preprocess: {
      js: {
        // first, we preprocess app.js
        src: 'dist/app.js',
        options: { inline: true }
      },
      html: {
        // then, we merge (@include) content in index.html.
        src: 'dist/index.html',
        options: { inline: true }
      }
    }
  });

  var platforms = ["android", "ios", "wp8", "web"];

  //
  // registering grunt copy-cordova-android-to-dist, copy-cordova-ios-to-dist, ...
  //  ex: copy /platforms/ios/cordova/cordova-2.4.0.js  => /dist/cordova.js
  //
  platforms.forEach(function (platform) {
    grunt.registerTask('copy-cordova-' + platform + '-to-dist', function () {
      grunt.file.copy('platforms/' + platform + '/cordova/cordova-' + cordovaVersion + '.js', 'dist/cordova.js');
    });
  });

  //
  // registering grunt copy-dist-to-android, copy-dist-to-ios, ...
  //  ex: copy /dist/index.html  => /platforms/android/build/index.html
  //
  platforms.forEach(function (platform) {
    grunt.registerTask('to-' + platform, function () {
    if (platform.indexOf('android')!=-1)
      grunt.file.copy('dist/index.html', 'platforms/' + platform + '/assets/www/index.html');		
    else
      grunt.file.copy('dist/index.html', 'platforms/' + platform + '/build/index.html');
    });
  });

  grunt.registerTask('copy-iostest', function () {
    grunt.file.copy('dist/index-build.html', 'src/index.html');
  });

  // Default task(s).
  grunt.registerTask('android', ['clean', 'copy-cordova-android-to-dist', 'template', 'concat', 'copy', 'preprocess', 'to-android']);
  grunt.registerTask('ios', ['clean', 'copy-cordova-ios-to-dist', 'template', 'concat', 'preprocess', 'to-ios']);
  grunt.registerTask('wp8', ['clean', 'copy-cordova-wp8-to-dist', 'template', 'concat', 'copy', 'preprocess', 'to-wp8']);
  grunt.registerTask('web', ['clean', 'copy-cordova-web-to-dist', 'template', 'concat', 'copy', 'preprocess', 'to-web']);
  grunt.registerTask('default', 'android');
};