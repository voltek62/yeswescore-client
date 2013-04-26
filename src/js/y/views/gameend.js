Y.Views.GameEnd = Y.View.extend({
  el:"#content",

  events: {
    'submit form#frmEndGame':'endGame'
  },

  pageName: "gameEnd",
  pageHash : "games/end/",
    
  initialize:function() {
  
    Y.GUI.header.title("TERMINER LA PARTIE");	    
  
    this.gameEndTemplate = Y.Templates.get('gameEnd');
    //owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
    //this.players = new PlayersCollection("me");
    this.owner = Y.User.getPlayer().toJSON();
    this.render();
    //$.mobile.hidePageLoadingMsg(); 
  },
  
  endGame: function (event) {
    var privateNote = $('#privateNote').val(),
    fbNote = $('#fbNote').val();
        
    //Backbone.Router.navigate("/#games/"+game.id, true);
    alert(privateNote+' '+fbNote);
    return false;
  },
  
  //render the content into div of view
  render: function(){
	  this.$el.html(this.gameEndTemplate({playerid:this.owner.id, token:this.owner.token}));
	  //this.$el.trigger('pagecreate');
	  return this;
  },

  onClose: function(){
    this.undelegateEvents();
  }
});