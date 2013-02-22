(function(Y, undefined) {
  "use strict";

  //wrapper around cordova geolocation
  Y.Geolocation = {longitude:null,latitude:null};

  // ici setInterval
  Cordova.ready(function () {
    
    setInterval(function () {
       // code cordova
      
      if (Cordova.Geolocation !== undefined) {
        // FIXME: si objet null, on regarde dans le localStorage
        // Puis on reprend derniere position
        // Cordova.Geolocation.latitude
        Cordova.Geolocation.getCurrentPosition(function (coords) { 
          
        if (Y.Geolocation.longitude!==coords.longitude || Y.Geolocation.latitude!==coords.latitude) 
        {  
            Y.Geolocation.longitude = coords.longitude;
            Y.Geolocation.latitude = coords.latitude;        
            Y.Geolocation.trigger("change", [Y.Geolocation.latitude, Y.Geolocation.longitude]); 
        }
          
        });
       
        
      } else
        setInterval(getCurrentPosition, 5000);
      
    }, 5000);
    
  });
  
  
})

(Y);
_.extend(Y.Geolocation, Backbone.Events);