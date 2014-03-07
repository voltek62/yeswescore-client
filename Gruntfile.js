module.exports = function (grunt) {
  // cordova version (used in cordova-2.4.0.js)

  // External tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-template-helper');
  grunt.loadNpmTasks('grunt-env');

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
  var context = {};
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
    /*
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
    */
    inlineTemplates: {
      files: {
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
          { expand: true, flatten: true, src: ['src/images/*'], dest: 'platforms/android/assets/www/images/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/images/*'], dest: 'platforms/ios/www/images/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/images/*'], dest: 'platforms/wp8/build/images/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/images/*'], dest: 'platforms/web/build/images/', filter: 'isFile' }
        ]
      },
      locales: {
        files: [
          { expand: true, flatten: true, src: ['src/locales/fr-FR/*'], dest: 'platforms/android/assets/www/locales/fr-FR/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/fr-FR/*'], dest: 'platforms/ios/www/locales/fr-FR/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/fr-FR/*'], dest: 'platforms/wp8/build/locales/fr-FR/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/fr-FR/*'], dest: 'platforms/web/build/locales/fr-FR/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/fr/*'], dest: 'platforms/android/assets/www/locales/fr/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/fr/*'], dest: 'platforms/ios/www/locales/fr/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/fr/*'], dest: 'platforms/wp8/build/locales/fr/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/fr/*'], dest: 'platforms/web/build/locales/fr/', filter: 'isFile' },

          { expand: true, flatten: true, src: ['src/locales/en-EN/*'], dest: 'platforms/android/assets/www/locales/en-EN/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/en-EN/*'], dest: 'platforms/ios/www/locales/en-EN/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/en-EN/*'], dest: 'platforms/wp8/build/locales/en-EN/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/en-EN/*'], dest: 'platforms/web/build/locales/en-EN/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/en/*'], dest: 'platforms/android/assets/www/locales/en/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/en/*'], dest: 'platforms/ios/www/locales/en/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/en/*'], dest: 'platforms/wp8/build/locales/en/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/locales/en/*'], dest: 'platforms/web/build/locales/en/', filter: 'isFile' }
        ]
      },	  
      fonts: {
        files: [
          { expand: true, flatten: true, src: ['src/styles/webfonts/*'], dest: 'platforms/android/assets/www/styles/webfonts/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/styles/webfonts/*'], dest: 'platforms/ios/www/styles/webfonts/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/styles/webfonts/*'], dest: 'platforms/wp8/build/styles/webfonts/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['src/styles/webfonts/*'], dest: 'platforms/web/build/styles/webfonts/', filter: 'isFile' }
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
    ifdef: {
      files: {
        src: [ "dist/app.css", "dist/app.js", "dist/index.html"],
        dest: [ "dist/app.css", "dist/app.js", "dist/index.html"]
      }
    },
    include: {
      files: {
        src: [ "dist/index.html" ],
        dest: [ "dist/index.html" ]
      }
    },
    env: {
      cordova: {
        CORDOVA: true,
        NOCORDOVA: false,
        STRICT:true
      },
      web: {
        CORDOVA: true,
        NOCORDOVA: false
      },
      androidAlpha: {
        ANDROID: true,
        DEV: true
      },
      androidBeta: {
        ANDROID: true
      },	  
      iosAlpha: {
        IOS: true,
        DEV: true
      },	  
      iosBeta: {
        IOS: true
      },	
      wp8Alpha: {
        WP8: true,
        DEV: true
      },	  
      wp8Beta: {
        WP8: true
      }
    }
  });

  var platforms = [ ["android","2.9.0"], 
                    ["ios","3.4.0"], 
                    ["wp8","2.6.0"], 
                    ["web","2.5.0"] ];

  //
  // registering grunt copy-cordova-android-to-dist, copy-cordova-ios-to-dist, ...
  //  ex: copy /platforms/ios/cordova/cordova-2.4.0.js  => /dist/cordova.js
  //
  platforms.forEach(function (platform) { 
    grunt.registerTask('copy-' + platform[0] + '-to-dist', function () {
    if (platform[0].indexOf('web') != -1) {
      grunt.file.copy('empty.js', 'dist/cordova.js');
      grunt.file.copy('empty.js', 'dist/cordova_plugins.js');
      grunt.file.copy('empty.js', 'dist/pushnotification.js');
      grunt.file.copy('empty.js', 'dist/social.js');	  		
    }
    else {
      grunt.file.copy('platforms/' + platform[0] + '/cordova/cordova-' + platform[1] + '.js', 'dist/cordova.js');
      grunt.file.copy('platforms/' + platform[0] + '/www/cordova_plugins.js', 'dist/cordova_plugins.js');
      //grunt.file.copy('platforms/' + platform[0] + '/cordova/pushnotification.js', 'dist/pushnotification.js');
      //grunt.file.copy('platforms/' + platform[0] + '/cordova/social.js', 'dist/social.js');  
      grunt.file.copy('empty.js', 'dist/pushnotification.js');
      grunt.file.copy('empty.js', 'dist/social.js');

      //grunt.file.copy('platforms/' + platform[0] + '/cordova/config.xml', 'dist/config.xml');
      //grunt.file.copy('platforms/' + platform[0] + '/cordova/location.properties', 'dist/location.properties');
    }
    });   
  });

  //
  // registering grunt copy-dist-to-android, copy-dist-to-ios, ...
  //  ex: copy /dist/index.html  => /platforms/android/build/index.html
  //
  platforms.forEach(function (platform) {
    grunt.registerTask('to-' + platform[0], function () {
      if (platform[0].indexOf('android') != -1) {
        grunt.file.copy('dist/index.html', 'platforms/' + platform[0] + '/assets/www/index.html');
        //grunt.file.copy('dist/config.xml', 'platforms/' + platform[0] + '/www/config.xml');
        //grunt.file.copy('dist/location.properties', 'platforms/' + platform[0] + '/assets/location.properties');
      }
      else if (platform[0].indexOf('ios') != -1)
        grunt.file.copy('dist/index.html', 'platforms/' + platform[0] + '/www/index.html');
      else if (platform[0].indexOf('web') != -1)
        grunt.file.copy('dist/index.html', 'www/index.html');
    else
        grunt.file.copy('dist/index.html', 'platforms/' + platform[0] + '/build/index.html');
    });
  });


  // Default task(s).
  grunt.registerTask('android-beta', ['clean', 'env:cordova', 'copy-android-to-dist','inlineTemplates', 'concat', 'copy', 'ifdef', 'include', 'to-android']);
  grunt.registerTask('android-alpha', ['clean', 'env:cordova', 'env:androidAlpha', 'copy-android-to-dist', 'inlineTemplates', 'concat', 'copy', 'ifdef', 'include', 'to-android']);
  grunt.registerTask('ios-beta', ['clean', 'env:cordova', 'copy-ios-to-dist','inlineTemplates', 'concat', 'copy', 'ifdef', 'include', 'to-ios']);  
  grunt.registerTask('ios-alpha', ['clean', 'env:cordova', 'env:iosAlpha', 'copy-ios-to-dist', 'inlineTemplates', 'concat', 'copy', 'ifdef', 'include', 'to-ios']);
  grunt.registerTask('wp8-beta', ['clean', 'env:cordova', 'copy-wp8-to-dist', 'inlineTemplates', 'concat', 'copy', 'ifdef', 'include', 'to-wp8']);
  grunt.registerTask('wp8-alpha', ['clean', 'env:cordova', 'env:wp8Alpha', 'copy-wp8-to-dist', 'inlineTemplates', 'concat', 'copy', 'ifdef', 'include', 'to-wp8']);
  grunt.registerTask('web', ['clean', 'env:web', 'copy-web-to-dist', 'inlineTemplates', 'concat', 'copy', 'ifdef', 'include', 'to-web']);
  grunt.registerTask('test', ['inlineTemplates']);
  grunt.registerTask('default', 'android');
};