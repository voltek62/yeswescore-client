(function (Cordova, undefined) {
  //#ifdef STRICT
  "use strict";
  //#endif

  // registering geolocalisation only when cordova is ready.
  Cordova.deviceready(function () {
	
	// After device ready, create a local alias
	var facebookConnect = window.cordova.facebookConnect;

	
	facebookConnect.login({permissions: ["email", "user_about_me"], appId: Y.Conf.get("facebook.app.id")}, function(result) {
	    console.log("FacebookConnect.login:" + JSON.stringify(result));
	
	    // Check for cancellation/error
	    if(result.cancelled || result.error) {
	        console.log("FacebookConnect.login:failedWithError:" + result.message);
	        return;
	    }
	
	    // Basic graph request example
	    facebookConnect.requestWithGraphPath("/me/friends", {limit: 100}, function(result) {
	        console.log("FacebookConnect.requestWithGraphPath:" + JSON.stringify(result));
	    });
	
	    // Feed dialog example
	    var dialogOptions = {
	        link: 'https://developers.facebook.com/docs/reference/dialogs/',
	        picture: 'http://fbrell.com/f8.jpg',
	        name: 'Facebook Dialogs',
	        caption: 'Reference Documentation',
	        description: 'Using Dialogs to interact with users.'
	    };
	    facebookConnect.dialog('feed', dialogOptions, function(response) {
	        console.log("FacebookConnect.dialog:" + JSON.stringify(response));
	    });
	
	});

  });
})(Cordova);
