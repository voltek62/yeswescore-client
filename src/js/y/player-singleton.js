(function (Y, undefined) {
  "use strict";

 var Player = function() {

    if ( Player.prototype._singletonInstance ) {
      return Player.prototype._singletonInstance;
    }
    
    var Owner = window.localStorage.getItem("Y.Cache.Player");
    
    if (Owner === null) {
      console.log('Pas de Owner, on efface la cache . On crée le Owner');        
      window.localStorage.removeItem("Y.Cache.Player");
      player = new PlayerModel();
      player.save();
      
      //wait object in localstorage
      
    }
    else
    	Player.prototype._singletonInstance = Owner;
    	
    
    //Player.prototype._singletonInstance = this;

	return Player.prototype._singletonInstance;
       
  };


  // exporting to global scope
  Y.Player = Player;
})(Y);
