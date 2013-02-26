/*global module:false*/
module.exports = function (grunt) {
    
    // External tasks.
    grunt.loadNpmTasks('grunt-less');

    // Custom tasks.
    grunt.loadTasks('grunt-tasks');

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
            ' *\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> zeNodus' +
            ' *\n' +
            ' * Date: <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>\n' +
            ' */'
        },
        lint: {
            files: [
                'grunt-tasks/build.js',
                'grunt.js',
                'src/js/**/*.js'
            ]
        },
        concat: {
            dist_javascript: {
                src: [
                    '<banner:meta.banner>', 
                    
                    // Order is important.
					'src/js/external-libs/jquery-1.8.2.min.js',
					'src/js/jq-config.js',
					'src/js/helpers.js',
					'src/js/jqm-config.js',
					'src/js/external-libs/jquery.mobile-1.2.0.min.js',
					'src/js/external-libs/lodash.min.js',
					'src/js/external-libs/backbone-min.js',
					'src/js/external-libs/backbone.offline.js',
					'src/js/external-libs/backbone.poller.min.js'
					
                ],
                dest: 'dist/app.js'
            },
        },
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist_javascript.dest>'],
                dest: 'dist/app.min.js'
            }
        },
        copy: {
            dist: {
                src: [
                    'lib/cordova/cordova-1.8.1-android.js',
                    'lib/cordova/cordova-1.8.1-ios.js',
                    'images/*',

                    // This will get processed as an underscore template
                    // with grunt in its scope. This feature is a hack
                    // in the jQuery UI grunt copy extension. Would be
                    // nicer to use <file_template:> directive, but this
                    // isn't possible with grunt.file.copy().
                    'index.html'
                ],
                strip: 'lib/cordova',
                dest: 'dist'
            },
            dist_android: {
                src: [
                    'dist/cordova-1.8.1-android.js',
                    'dist/images/*',
                    'dist/app.js',
                    'dist/app.min.js',
                    'dist/styles.css',
                    'dist/index.html'
                ],
                renames: {
                    'android/assets/www/cordova-1.8.1-android.js': 'cordova.js'
                },
                strip: 'dist/',
                dest: 'android/assets/www'
            },
            dist_ios: {
                src: [
                    'dist/cordova-1.8.1-ios.js',
                    'dist/images/*',
                    'dist/app.js',
                    'dist/app.min.js',
                    'dist/styles.css',
                    'dist/index.html',
                    'dist/templates.html'
                ],
                renames: {
                    'ios/www/cordova-1.8.1-ios.js': 'cordova.js'
                },
                strip: 'dist/',
                dest: 'ios/www'
            }
        },
        watch: {
            files: [
                '<config:lint.files>', 
                '<config:concat.dist_less.src>', 
                'src/views/**/*.html', 
                'index.html'
            ],
            tasks: 'default'
        },
        jshint: {
            options: {
                curly: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                expr: true
            },
            globals: {
                jQuery: true,
                Zepto: true,
                Backbone: true,
                _: true,
                $: true,
                iScroll: true,
                Deferred: true,
                module: true,
                console: true
            }
        },
        uglify: {}
    });

    // Default task.
	// concat:dist_less min less copy:dist copy:dist_android
    grunt.registerTask('default', 'clean lint concat:dist_javascript ');

};
