Y.Views.GameComment = Y.View.extend({
  el:"#content",
  gameid:'',
  
  incomingComment : "#incomingComment",

  pageName: "gameComment",
  pageHash : "games/comment/",

  events: {
    // mode "input"
    'focus textarea': 'inputModeOn',
    'blur textarea': 'inputModeOff', 
      
    'click #sendComment'  : 'sendComment',
    'click .deleteComment': 'deleteComment',
    'click .warnComment': 'warnComment'        
  },

    
  initialize:function() {
    this.pageHash += this.id; 
    this.gameid = this.id;
    this.game = null;

    // header
    Y.GUI.header.title("COMMENTAIRES");
  
    // loading templates.
    this.gameCommentTemplate = Y.Templates.get('gameComment');
    this.gameViewCommentListTemplate = Y.Templates.get('gameCommentList');

    // loading owner
    this.Owner = Y.User.getPlayer();

    // we render immediatly
    this.render();

    // FIXME 1: appeler render immédiatement, qui affiche un message d'attente car this.game n'est pas encore rempli
    // FIXME 2: utiliser une factory pour recuperer l'objet game.
   	var game = new GameModel({id : this.id});
    game.on("sync", function () {
      this.game = game;
      this.render(); // might be later.
    });

    
    /*
   	this.streams = new StreamsCollection({id : this.id});
    this.streams.fetch();
    this.streams.once("sync", this.renderRefresh, this);
    */
    /*
    var options = {
          delay : Y.Conf.get("game.refresh")
    };
    
    poller = Backbone.Poller.get(this.streams, options)
    poller.start();
    poller.on('success', this.getObjectUpdated, this);
	  */

	//this.streams.on("all",this.renderRefresh,this);

  },
  
  
  //render the content into div of view
  render: function(){
	  var token = this.Owner.toJSON().token;
 	  var playerid = this.Owner.id;
    var game = (this.game) ? this.game.toJSON() : null;

	  this.$el.html(this.gameCommentTemplate({
      game : game,
      playerid: playerid,
      token:token
    }));
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
            Owner : this.Owner.toJSON()
          }));
                   
          //$(this.incomingComment).html('vincent '+JSON.stringify(this.streams.toJSON()));

        }
        //return this;+
        return false;
  }, 


  deleteComment : function(e) {
      
    var elmt = $(e.currentTarget);
  	var id = elmt.attr("id");
  		
    
    Backbone.ajax({
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
  		
    
    Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.reports.games")+ this.gameid + '/stream/'+ id + '/',
        type : 'POST',
        success : function(result) {
          //console.log('data Warn', result);
        }
      });
    
      
  },

  sendComment : function() {
  
  	//console.log('sendComment');
  
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
    
    console.log('sendComment stream',stream.toJSON());
    
    stream.save();

    $('#messageText').val('');
    
    this.renderRefresh();
    
  },

  onClose: function(){
    this.undelegateEvents();
    
    poller.stop();
    poller.off('success', this.renderRefresh, this);
  }
});