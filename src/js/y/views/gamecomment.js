var GameCommentView = Backbone.View.extend({
  el:"#content",
  
  incomingComment : "#incomingComment",

  events: {
        'vclick #commentDeleteButton' : 'commentDelete',
        'vclick #commentSendButton' : 'commentSend',
        'vclick .deleteComment' : 'deleteComment'   
  },

  pageName: "gameComment",
    
  initialize:function() {
    this.gameCommentTemplate = Y.Templates.get('gameCommentTemplate');
    this.gameViewCommentListTemplate = Y.Templates
            .get('gameViewCommentListTemplate');
               
    //Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
    //this.players = new PlayersCollection("me");
   
    this.Owner = Y.User.getPlayer();

    
   	this.score = new GameModel({id : this.id});
    this.score.fetch();
    
    this.score.on("all",this.render,this);

   	this.comment = new StreamModel({id : this.id});
    this.comment.fetch();
    
    var options = {
          // default delay is 1000ms
          // FIXME : on passe sur 30 s car souci avec API
          delay : Y.Conf.get("game.refresh")
        // data: {id:this.id}
    };
    
    poller = Backbone.Poller.get(this.comment, options)
    poller.start();
    poller.on('success', this.getObjectUpdated, this);


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
  
  
  getObjectUpdated: function() {
        this.comment.on("all",this.renderRefresh,this);     
  },

      // render the content into div of view
  renderRefresh : function() {
        

        // if we have comments

        if (this.comment.toJSON().stream !== undefined) {
          
          $(this.incomingComment).html(this.gameViewCommentListTemplate({
            streams : this.comment.toJSON().stream.reverse(),
            Owner : this.Owner,
            query : ' '
          }));

        }
        
        //return this;+
        return false;
  }, 


  deleteComment : function(e) {
      
    var elmt = $(e.currentTarget);
  	var id = elmt.attr("id");
  		
  	//FIXME : On recupère le Owner.token et id pour etre sur que le comment lui appartient
  	// si retour du serveur, on supprime
    console.log('On efface le comment '+id);
      
  },

  commentSend : function() {
    var playerid = $('#playerid').val()
    , token  = $('#token').val()
    , gameid = $('#gameid').val()
    , comment = $('#messageText').val();

    var stream = new StreamModel({
          type : "comment",
          playerid : playerid,
          token : token,
          text : comment,
          gameid : gameid
    });
    // console.log('stream',stream);
    stream.save();

    $('#messageText').val();
  },

  onClose: function(){
    this.undelegateEvents();
  }
});