// Global Object
(function (global) {
  "use strict";

  var Cordova = {
    Geoloc: null,  // null until ready.

    // same as jquery ;)
    ready: (function () {
      var status = "uninitialized" // uninitialized, loading, loaded
        , callbacks = [];

      return function ready(callback) {
        switch (status) {
          case "uninitialized":
            // when Cordova is uninitialized, we just stack the callbacks.
            callbacks.push(callback);
            // we are now "loading"
            status = "loading";
            document.addEventListener("deviceready", function () {
              // We are now ready.
              status = "ready";
              _(callbacks).forEach(function (f) { f() });
            }, false);
            break;
          case "loading":
            // when Cordova is loading, we just stack the callbacks.
            callbacks.push(callback);
            break;
          case "ready":
            // when Cordova is ready, call the callback !
            setTimeout(callback, 10);
            break;
          default:
            throw "error";
        }
      };
    })(),
    
    readPermanent: function(key) {
      
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, errorFile);
      
      function gotFS(fileSystem) {
        fileSystem.root.getFile(YesWeScore.Conf.get("cordova.file"), null, gotFileEntry, errorFile);
      }
      
      function gotFileEntry(fileEntry) {
        fileEntry.file(gotFile, errorFile);
      }

      function gotFile(file){
        readAsText(file);
      }
      
      function readAsText(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("fileY read success");
            console.log("fileY read data : "+evt.target.result);
            try {
              var obj = JSON.parse(evt.target.result);
              
              console.log('fileY obj '+key+' on a '+obj.key);
              //FIXME: si OK on retourne objet
              
            }
            catch(e) {console.log('Error parse fileY '+e);}      
            
        };
        reader.readAsText(file);    
        
      }          
    },
    
    setPermanent: function(key,value){

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, errorFile);
      
      function gotFS(fileSystem) {
        fileSystem.root.getFile(YesWeScore.Conf.get("cordova.file"), {create: true, exclusive: false}, gotFileEntry, errorFile);
      }

      function gotFileEntry(fileEntry) {
          fileEntry.createWriter(gotFileWriter, errorFile);
      }

      function gotFileWriter(writer){
          
          writer.onwriteend = function(evt) {
          console.log('fileY written', evt);
          };
          
          console.log('fileY key: '+key+' value: '+value);
          
          //FIXME: ancien contenu à copier
          writer.write(JSON.stringify({key:value}));    
      }
    },    
    
    errorFile: function(evt) {
      var states = {};
      states[FileError.NOT_FOUND_ERR] = 'FileError.NOT_FOUND_ERR';
      states[FileError.SECURITY_ERR] = 'FileError.SECURITY_ERR';
      states[FileError.ABORT_ERR] = 'FileError.ABORT_ERR';
      states[FileError.NOT_READABLE_ERR] = 'FileError.NOT_READABLE_ERR';
      states[FileError.ENCODING_ERR] = 'FileError.ENCODING_ERR';
      states[FileError.NO_MODIFICATION_ALLOWED_ERR] = 'FileError.NO_MODIFICATION_ALLOWED_ERR';
      states[FileError.INVALID_STATE_ERR] = 'FileError.INVALID_STATE_ERR';
      states[FileError.SYNTAX_ERR] = 'FileError.SYNTAX_ERR';
      states[FileError.INVALID_MODIFICATION_ERR] = 'FileError.INVALID_MODIFICATION_ERR';
      states[FileError.QUOTA_EXCEEDED_ERR] = 'FileError.QUOTA_EXCEEDED_ERR';
      states[FileError.TYPE_MISMATCH_ERR] = 'FileError.TYPE_MISMATCH_ERR';
      states[FileError.PATH_EXISTS_ERR] = 'FileError.PATH_EXISTS_ERR';
      
      console.log('fileY: '+states[error.code]);
    }  
    
  };
  // exporting Cordova to global scope
  global.Cordova = Cordova;
})(this);