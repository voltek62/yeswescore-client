module.exports = function(grunt) {
  

  
  grunt.file.mkdir('dist/img');

  // External tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-template-helper');
  
  grunt.loadTasks('grunt-tasks');

  // Project configuration.
  grunt
      .initConfig({
        pkg : grunt.file.readJSON('package.json'),
        meta : {
          banner : '/*\n'
              + ' * <%= pkg.name %> v<%= pkg.version %>\n'
              + ' *\n'
              + ' * Copyright (c) <%= grunt.template.today("yyyy") %> zeNodus'
              + ' *\n'
              + ' * Date: <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>\n'
              + ' */'
        },
        jshint: {
          all: ['Gruntfile.js'
                , 'grunt-tasks/build.js'
                , 'src/js/collections/*.js'
                ,'src/js/models/*.js'
                ,'src/js/views/*.js'
                ,'src/js/y/*.js'                
                ]
        },      
        concat : {
          dist_javascript : {
            src : [ '<%= meta.banner %>'
                 // Order is important.
                ,'src/js/external-libs/jquery-1.8.2.min.js'
                ,'src/js/jq-config.js'
                ,'src/js/helpers.js', 'src/js/jqm-config.js'
                ,'src/js/external-libs/jquery.mobile-1.2.0.min.js'
                ,'src/js/external-libs/lodash.min.js'
                ,'src/js/external-libs/backbone-min.js'
                ,'src/js/external-libs/backbone.offline.js'
                ,'src/js/external-libs/backbone.poller.min.js'
                ,'src/js/cordova.js'
                ,'src/js/cordova/connection.js'
                ,'src/js/cordova/geolocation.js'
                ,'src/js/cordova/file.js'  
                ,'src/js/y.js'
                ,'src/js/y/conf.js'
                ,'src/js/y/connection.js'
                ,'src/js/y/router.js'
                ,'src/js/y/stats.js'
                ,'src/js/y/templates.js'
                ,'src/js/y/geolocation.js'                   
                // Core
                ,'src/js/models/game.js'
                ,'src/js/models/stream.js'
                ,'src/js/models/player.js'
                ,'src/js/models/club.js'
                ,'src/js/collections/games.js'
                ,'src/js/collections/players.js'        
                ,'src/js/collections/clubs.js'                      
                // Views
                ,'src/js/views/account.js' 
                ,'src/js/views/club.js' 
                ,'src/js/views/clubadd.js' 
                ,'src/js/views/game.js' 
                ,'src/js/views/gameadd.js' 
                ,'src/js/views/gameend.js' 
                ,'src/js/views/gamefollow.js'   
                ,'src/js/views/gamelist.js'     
                ,'src/js/views/index.js' 
                ,'src/js/views/player.js' 
                ,'src/js/views/playerfollow.js' 
                ,'src/js/views/playerform.js' 
                ,'src/js/views/playerlist.js' 
                ,'src/js/views/playersignin.js'
                ,'src/js/views/playerforget.js'   
                ,'src/js/views/index.js'
                ,'src/js/views/game.js'
                // start
                ,'src/js/main.js'                
               
            ],
            dest : 'dist/app.js'
          },
          dist_css : {
            src : [ '<%= meta.banner %>',
                 // Order is important.
                'src/styles/jquery.mobile-1.2.0.min.css', 
                'src/styles/main.css'
            ],
            dest : 'dist/style.css'
          },          
          
        },   
        uglify : {
          build : {
            src : 'dist/app.js',
            dest : 'dist/app.min.js'
          }
        },        
        cssmin: {
          my_target: {
              src: 'dist/style.css',
              dest: 'dist/style.min.css'
          }
        },
        
        /*
        template: {
          dev: {
            options: {
              data: {
                env: 'dev',
                message: 'hello'
              },
              wrap: {
                banner: '<script type="text/ng-template" from="#{0}" to="#{1}"></script>',
                footer: '</script>',
                inject: [{
                    prop: 'src'
                  }, {
                    prop: 'dest',
                    rem:  '/unwanted/path',
                    repl: {
                      ".wrongExtension": ".rightExtension"
                  }
                }]
              },
              minify: {
                mode: 'html',
                // Note that this is redundant, mode: 'html' does the same thing.
                pretty: {
                  mode: 'minify',
                  lang: 'markup',
                  html: 'html-yes'
                }
              }
            },
            files: 
              'path/to/result.html': 'path/to/input.template',
              'path/to/another.html': ['path/to/more/*.template', 'path/to/even/more/*.template'] // concatenates (individually wrapped) files
          }
        }*/

        watch : {
          files : [ 'src/views/**/*.html'
                    ,'index.html' ],
          tasks : 'default'
        },
        
        
        
        
      });
  
  
  grunt.registerTask('copy-index', function() {
    
    /*
     grunt.registerMultiTask('multicss', 'Minify CSS files in a folder', function() {
        grunt.file.expandFiles(this.data).forEach(function(file) {
            var minified = grunt.helper("mincss", grunt.file.read(file));
            grunt.file.write(file, minified);
            grunt.log.writeln("Minified CSS "+file);
        });
    });
     */

    //grunt.template.process('<%= baz %>', {data: obj})
    
    //var helpers = require('grunt-lib-legacyhelpers').init(grunt);
    //var result = helpers.concat(grunt.file.expandFiles(['src/templates/*.html']));
    
    //console.log(result);
    
    grunt.file.copy('index.html', 'dist/index.html');
  });  
  
  grunt.registerTask('copy-android', function() {

    grunt.file.copy('lib/cordova/cordova-2.4.0-android.js', 'android/assets/www/cordova.js');
    grunt.file.copy('dist/app.js','android/assets/www/app.js');
    grunt.file.copy('dist/app.min.js','android/assets/www/app.min.js');
    grunt.file.copy('dist/style.css','android/assets/www/styles.css');
    grunt.file.copy('dist/style.css','android/assets/www/styles.min.css');    
    grunt.file.copy('dist/index.html','android/assets/www/index.html');
    
    
  });


  // Default task(s).
  //'uglify','cssmin',
  grunt.registerTask('default', [ 'clean','concat','uglify','cssmin','copy-index','copy-android' ]);

};