var GameCommentView = Backbone.View.extend({
  el:"#content",

  events: {
    'submit form#frmCommentGame':'commentGame'
  },

  pageName: "gameComment",
    
  initialize:function() {
    this.gameCommentTemplate = Y.Templates.get('gameCommentTemplate');
    //Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
    //this.players = new PlayersCollection("me");
   
    this.Owner = Y.User.getPlayer();

    
   	this.score = new GameModel({id : this.id});
    this.score.fetch();
    
    this.score.on("all",this.render,this);
    
    //$.mobile.hidePageLoadingMsg(); 
  },
  
  commentGame: function (event) {
    var privateNote = $('#privateNote').val(),
    fbNote = $('#fbNote').val();
        
    //Backbone.Router.navigate("/#games/"+game.id, true);
    console.log("send comment ");
    
    return false;
  },
  
  //render the content into div of view
  render: function(){
	  this.$el.html(this.gameCommentTemplate({game : this.score.toJSON(),playerid:this.Owner.id, token:this.Owner.token}));
	  this.$el.trigger('pagecreate');
	  return this;
  },

  onClose: function(){
    this.undelegateEvents();
  }
});