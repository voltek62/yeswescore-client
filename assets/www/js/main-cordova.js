document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {

	/* navigator.splashscreen.hide(); */
	
	localStorage.clear();

	navigator.geolocation.getCurrentPosition(onGeoSuccess, onError);
	checkConnection();

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSuccess,
			onError);

	// phone init code that manipulates the DOM...
	// $.mobile.initializePage();
}

function onGeoSuccess(position) {

	appConfig.latitude = position.coords.latitude;
	appConfig.longitude = position.coords.longitude;

	console.log('GeoSuccess', appConfig);

}

function onError(position) {
	console.log('GeoError');

}

// alert dialog dismissed
function alertDismissed() {
	// do something

  /*navigator.splashscreen.hide();*/

  // localStorage.clear(); // why ? should be avoided ?

  // geolocalisation features are currently-disabled.
  //  Will be re-enabled on next refactoring.
  // navigator.geolocation.getCurrentPosition(onGeoSuccess, onError);
  //checkConnection();
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSuccess, onError);
  //phone init code that manipulates the DOM...
  //$.mobile.initializePage();
}
/* FiXME: DiSaBlEd
function onGeoSuccess(position) {
  appConfig.latitude = position.coords.latitude;
  appConfig.longitude = position.coords.longitude;
  console.log('GeoSuccess',appConfig);
}

function onError(position) {
  console.log('GeoError');
}
*/

// alert dialog dismissed
function alertDismissed() {
  // do something

}

// Show a custom alert
//
function showAlert() {

	navigator.notification.alert('You are the winner!', // message
	alertDismissed, // callback
	'Game Over', // title
	'Done' // buttonName
	);
}

function checkConnection() {

	var networkState = navigator.connection.type;

	if (networkState === 'none')
		appConfig.networkState = 'false';
	else
		appConfig.networkState = 'true';

}

function onFileSuccess(fileSystem) {
	fileSystem.root.getFile("yeswescore.json", {
		create : true,
		exclusive : false
	}, gotFileEntry, onError);
}

function gotFileEntry(fileEntry) {
	fileEntry.createWriter(gotFileWriter, onError);
}

function gotFileWriter(writer) {
	writer.write("test1,test2,test3");
}



/* FiXME: DiSaBlEd
function checkConnection() {
  var networkState = navigator.connection.type;

  if (networkState==='none')
    appConfig.networkState='false';
  else
    appConfig.networkState='true';
}
*/

function onFileSuccess(fileSystem) {
  fileSystem.root.getFile("yeswescore.csv", {create: true, exclusive: false }, gotFileEntry, onError);
}

function gotFileEntry(fileEntry) {
  fileEntry.createWriter(gotFileWriter, onError);
}
    
function gotFileWriter(writer) {
  writer.write("test1,test2,test3");
}

