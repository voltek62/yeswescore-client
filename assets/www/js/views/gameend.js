var GameEndView = Backbone.View.extend({
  el:"#index",

  events: {
    'submit form#frmEndGame':'endGame'
  },
    
  initialize:function() {
    this.gameEndTemplate = Y.Templates.get('gameEndTemplate');
    Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
    //this.players = new PlayersCollection("me");
    //this.Owner = new PlayerModel(this.players.storage.findAll({local:true}));  
    this.render();
    $.mobile.hidePageLoadingMsg(); 
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
	  this.$el.html(this.gameEndTemplate({playerid:Owner.id, token:Owner.token}));
	  this.$el.trigger('pagecreate');
	  return this;
  },

  onClose: function(){
    this.undelegateEvents();
  }
});