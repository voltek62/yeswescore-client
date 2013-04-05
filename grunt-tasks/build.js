/*
 * PARTIE DU CODE QUI VA ELIMINER BEGIN DEV AND END DEV du code source
 * 
 */
module.exports = function( grunt ) {
  "use strict";

  var rimraf = require("rimraf");

  (function () {
    var regexps = [
      // <!-- #ifdef KEY --> ... <!-- #endif -->
      /<!\-\-\s*#ifdef\s+([a-zA-Z0-9_]+)\s*\-\->([\s\S]*?)<!\-\-\s*#endif\s*\-\->/gm,
      // /* #ifdef KEY */.... /* #endif */-->
      /\/\*\s*#ifdef\s+([a-zA-Z0-9_]+)\s*\*\/([\s\S]*?)\/\*\s*#endif\s*\*\//gm
    ];

    grunt.registerMultiTask('ifdef', 'ifdef', function() {
      // Iterate over all specified file groups.
      this.files.forEach(function(f) {
      
        // this plugin doesn't concat.
        // we need the same number of src & dest files
        if (f.src.length !== f.dest.length) {
          grunt.log.warn('Number of source and destination file differs files.src.length='+f.src.length+', files.dest.length='+f.dest.length);
          return false;
        }

        // processing files
        var src = f.src.forEach(function(filepath, i) {
          // Warn on and remove invalid source files (if nonull was set).
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
          }
          var filecontent = grunt.file.read(filepath);
          // searching #ifdef ... #endif
          regexps.forEach(function (r) {
            var m, stripped = [];
            while (m = r.exec(filecontent)) {
              if (!process.env[m[1]]) { // key doesn't exist in env or is false/null/..
                grunt.log.writeln("#ifdef "+m[1]+" => false");
                grunt.log.writeln("stripping \n"+m[2]);
                stripped.push(process.env[0])
              } else {
                grunt.log.writeln("#ifdef "+m[1]+" => true");
              }
            }
            stripped.forEach(function (s) {
              filecontent = filecontent.replace(s, "");
            });
          });

          // Write the destination file.
          console.log('writing : ' + f.dest[i]);
          grunt.file.write(f.dest[i], filecontent);
        });
      });
    });
  })();

  (function () {
    // <!-- @include file -->
    var regexp = /<!\-\-\s*\@include\s+([a-zA-Z0-9_\.\/]+)\s*\-\->/gm;

    grunt.registerMultiTask('include', 'include', function() {
      // Iterate over all specified file groups.
      this.files.forEach(function(f) {
      
        // this plugin doesn't concat.
        // we need the same number of src & dest files
        if (f.src.length !== f.dest.length) {
          grunt.log.warn('Number of source and destination file differs files.src.length='+f.src.length+', files.dest.length='+f.dest.length);
          return false;
        }

        // processing files
        var src = f.src.forEach(function(filepath, i) {
          // Warn on and remove invalid source files (if nonull was set).
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
          }
          var filecontent = grunt.file.read(filepath)
            , result = filecontent;
          // searching includes
          var m, result;
          while (m = regexp.exec(filecontent)) {
            grunt.log.writeln("@include file "+m[1]+" in "+filepath);
            var includedcontent = grunt.file.read(m[1]);
            result = result.replace(m[0], includedcontent);
          }

          // Write the destination file.
          grunt.file.write(f.dest[i], filecontent);
        });
      });
    });
  })();

  // Based on jQuery UI build.js
  grunt.registerTask("clean", function () {
      rimraf.sync("dist");
      rimraf.sync("platforms/android/build");
      rimraf.sync("platforms/ios/build");
      rimraf.sync("platforms/wp8/build");
      rimraf.sync("platforms/blackberry/build");
  });
};
