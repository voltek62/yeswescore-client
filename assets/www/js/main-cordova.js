document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {

	/* navigator.splashscreen.hide(); */
	
	localStorage.clear();

	//navigator.geolocation.getCurrentPosition(onGeoSuccess, onError);
	//checkConnection();

	//TU
  readPermanent('object_json');	
	
  setPermanent('object_json',{DateOfDay:new Date()});  
	
	//on lit un objet
  readPermanent('object_json');
  
 

	// phone init code that manipulates the DOM...
	// $.mobile.initializePage();
}

/*
function onGeoSuccess(position) {

	appConfig.latitude = position.coords.latitude;
	appConfig.longitude = position.coords.longitude;

	console.log('GeoSuccess', appConfig);

}
*/

function onError(e) {
	console.log(e);

}


function readPermanent(key) {
    
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
  
  function gotFS(fileSystem) {
    fileSystem.root.getFile(YesWeScore.Conf.get("cordova.file"), null, gotFileEntry, fail);
  }
  
  function gotFileEntry(fileEntry) {
    fileEntry.file(gotFile, fail);
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
  
  function fail(evt) {
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
       
}


function setPermanent(key,value){

  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
  
  function gotFS(fileSystem) {
    fileSystem.root.getFile(YesWeScore.Conf.get("cordova.file"), {create: true, exclusive: false}, gotFileEntry, fail);
  }

  function gotFileEntry(fileEntry) {
      fileEntry.createWriter(gotFileWriter, fail);
  }

  function gotFileWriter(writer){
      
      writer.onwriteend = function(evt) {
      console.log('fileY written', evt);
      };
      
      console.log('fileY key: '+key+' value: '+value);
      
      //FIXME: ancien contenu à copier
      
      writer.write(JSON.stringify({key:value}));    
  }
  
  function fail(error){ 
    
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
  
}
