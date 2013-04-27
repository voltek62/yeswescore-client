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

    this.owner = Y.User.getPlayer().toJSON();
    this.render();

  },
  
  endGame: function (event) {
    var privateNote = $('#privateNote').val(),
    fbNote = $('#fbNote').val();
        
    //Y.Router.navigate("/#games/"+game.id, true);
    alert(privateNote+' '+fbNote);
    return false;
  },
  
  //render the content into div of view
  render: function(){
	  this.$el.html(this.gameEndTemplate({playerid:this.owner.id, token:this.owner.token}));
	  return this;
  },

  onClose: function(){
    this.undelegateEvents();
  }
});