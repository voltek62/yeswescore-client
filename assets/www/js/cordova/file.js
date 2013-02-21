(function (Cordova, undefined) {
  "use strict";

  // wrapper around cordova file
  // TEMPORARY works in Ripple
  // PERSISTENT is bugged in Ripple
  var File = {
      
      readJSON: function(k,result) {
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, File.errorFile);
        
        function gotFS(fileSystem) {
          try {
            fileSystem.root.getFile(YesWeScore.Conf.get("cordova.file"), null, gotFileEntry, File.errorFile);
          }
          catch(e) {result('');}            
        }
        
        function gotFileEntry(fileEntry) {
          
          try {
            fileEntry.file(gotFile, File.errorFile);
          }
          catch(e) {result('');}
          
        }

        function gotFile(file){
          try {
            readAsText(file);
          }
          catch(e) {result('');}
        }
        
        function readAsText(file) {
          var reader = new FileReader();
          reader.onloadend = function(evt) {
              console.log("fileY read success");
              console.log("fileY read data : "+evt.target.result);
              try {
                var obj = evt.target.result;
                
                console.log('fileY obj '+k+' on a '+obj.k);
                //FIXME: si OK on retourne objet
                result(obj.k);    
                
              }
              catch(e) {console.log('Error parse fileY ',e),result('');      
            }  
          };
          reader.readAsText(file);    
          
        }          
      },
      
      writeJSON: function(key,value){

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, File.errorFile);
        
        function gotFS(fileSystem) {
          fileSystem.root.getFile(YesWeScore.Conf.get("cordova.file"), {create: true, exclusive: false}, gotFileEntry, File.errorFile);
        }

        function gotFileEntry(fileEntry) {
            fileEntry.createWriter(gotFileWriter, File.errorFile);
        }

        function gotFileWriter(writer){
            
            writer.onwriteend = function(evt) {
            console.log('fileY written', evt);
            };
            
            console.log('fileY key: '+key+' value: '+value);
            
            var o = {}; 
            o[key] = value;
            var data = JSON.stringify(o);
                        
            //On enregistre dans les variables de confs
            YesWeScore.Conf.setNX((YesWeScore.Conf.get("cordova.file"), data, 'json'));
            
            //FIXME: ancien contenu à copier
            writer.write(data);   
        }
      },    
      
      errorFile: function(error) {
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

  // registering geolocalisation only when cordova is ready.
  Cordova.ready(function () {

    /*
    Cordova.File = File;
    File.readJSON('object_json'); 
    File.writeJSON('object_json',{DateOfDay:new Date()});  
    
    var resultat='';
    File.readJSON('object_json',function result(r){resultat=r});
    
    console.log('fileY test de lecture, on lit objet ',resultat.DateOfDay);
    */
    
  });
})(Cordova);