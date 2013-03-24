var GameCommentView = Backbone.View.extend({
  el:"#content",
  gameid:'',
  
  incomingComment : "#incomingComment",

  events: {
        'click #sendComment'  : 'sendComment',
        'click .deleteComment': 'deleteComment',
        'click .warnComment': 'warnComment'        
  },

  pageName: "gameComment",
    
  initialize:function() {
  
     $.ui.setBackButtonVisibility(true);
     $.ui.setBackButtonText("&lt;");
     $.ui.setTitle("COMMENTAIRES");
  
    this.gameCommentTemplate = Y.Templates.get('gameCommentTemplate');
    this.gameViewCommentListTemplate = Y.Templates.get('gameViewCommentListTemplate');
               
    //Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
    //this.players = new PlayersCollection("me");
   
    this.Owner = Y.User.getPlayer();

	//console.log("Owner",this.Owner.toJSON());
	//console.log("Owner.token",this.Owner.toJSON().token);
    this.gameid=this.id;
    
   	this.score = new GameModel({id : this.id});
    this.score.fetch();
    
    this.score.on("all",this.render,this);

   	this.streams = new StreamsCollection({id : this.id});
    this.streams.fetch();
    
    var options = {
          delay : Y.Conf.get("game.refresh")
    };
    
    poller = Backbone.Poller.get(this.streams, options)
    poller.start();
    poller.on('success', this.getObjectUpdated, this);

	//this.streams.on("all",this.renderRefresh,this);

  },
  
  
  //render the content into div of view
  render: function(){
    
	  var token = this.Owner.toJSON().token;
 	  var playerid = this.Owner.id;
  
	  this.$el.html(this.gameCommentTemplate({game : this.score.toJSON(),playerid:this.Owner.id,token:token}));
	  this.$el.trigger('pagecreate');
	  return this;
  },
  
  
  getObjectUpdated: function() {
        this.streams.on("all",this.renderRefresh,this);     
  },

      // render the content into div of view
  renderRefresh : function() {
        
        if (this.streams.toJSON() !== undefined) {
        
		 //FIXME : gérer la date en temps écoulé
          $(this.incomingComment).html(this.gameViewCommentListTemplate({
            streams  : this.streams.toJSON(),
            Owner : this.Owner
          }));
          
          
          //$(this.incomingComment).html('vincent '+JSON.stringify(this.streams.toJSON()));
          
          $(this.incomingComment).trigger('create');

        }
        
        //return this;+
        return false;
  }, 


  deleteComment : function(e) {
      
    var elmt = $(e.currentTarget);
  	var id = elmt.attr("id");
  		
    
    $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games")
        + this.gameid 
        + '/stream/'
        + id 
        + '/?playerid='+this.Owner.id
        +'&token='+this.Owner.toJSON().token
        +'&_method=delete',
        
        type : 'POST',
        success : function(result) {
          //console.log('data Warn', result);
        }
      });    
      
      //$('#2 .c:eq(1)').html("<p>Hello</p>");
      $("#comment"+id).remove();
  },

  warnComment : function(e) {
      
    var elmt = $(e.currentTarget);
  	var id = elmt.attr("id");
  		
    
    $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.reports.games")+ this.gameid + '/stream/'+ id + '/',
        type : 'POST',
        success : function(result) {
          //console.log('data Warn', result);
        }
      });
    
      
  },

  sendComment : function() {
  
  	console.log('sendComment');
  
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
    
    this.renderRefresh();
    
  },

  onClose: function(){
    this.undelegateEvents();
    
    poller.stop();
    poller.off('success', this.renderRefresh, this);
  }
});