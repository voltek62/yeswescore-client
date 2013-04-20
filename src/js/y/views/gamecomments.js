Y.Views.GameComment = Y.View.extend({
  el:"#content",
  gameid:'',

  pageName: "gameComment",
  pageHash : "games/comment/",

  events: {
    // mode "input"
    'focus textarea': 'inputModeOn',
    'blur textarea': 'inputModeOff', 
      
    'click *[data-js="sendComment"]'  : 'sendComment',
    'click *[data-js="deleteComment"]': 'deleteComment',
    'click *[data-js="deleteComment"]': 'reportComment'        
  },

  initialize:function() {
    this.pageHash += this.id; 
    this.gameid = this.id;
    this.game = null;
    this.streamItemsCollection = null;

    // header
    Y.GUI.header.title("COMMENTAIRES");
  
    // loading templates.
    this.templates = {
      layout: Y.Templates.get('gameComment'),
      score:  Y.Templates.get('gameCommentScore'),
      list: Y.Templates.get('gameCommentList')
    };

    // loading owner
    this.Owner = Y.User.getPlayer();

    // we render immediatly
    this.render();

    // FIXME: utiliser une factory pour recuperer l'objet game.
    // FIXME: quand la factory existera et que les objets seront globaux
    //         on pourra activer du pooling sur l'objet.
   	var game = new GameModel({id : this.gameid});
    game.once("sync", function () {
      this.game = game;
      this.renderScore(); // might be later.
    });

    this.streamItemsCollection = new StreamsCollection([], {gameid : this.gameid});
    var pollingOptions = { delay: Y.Conf.get("game.refresh") };
    this.poller = Backbone.Poller.get(this.streamItemsCollection, pollingOptions);
    this.poller.on('success', this.renderList, this);
    this.poller.start();
  },
  
  render: function () {
    // empty page.

	  this.$el.html(this.templates.layout());
	  return this;
  },
  
  // score component (top of the page)
  renderScore: function () {
	  this.$(".score").html(this.templates.score({game : this.game}));
	  return this;
  },

  // liste de commentaires 
  renderList : function() {
    this.$("#incomingComment").html(this.templates.list({
      streams  : this.streamItemsCollection.toJSON(),
      Owner : this.Owner.toJSON()
    }));
    return this;
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
        }
      });    
      
      //$('#2 .c:eq(1)').html("<p>Hello</p>");
      $("#comment"+id).remove();
  },

  reportComment : function(e) {
    var elmt = $(e.currentTarget);
  	var id = elmt.attr("id");

    Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.reports.games")+ this.gameid + '/stream/'+ id + '/',
        type : 'POST',
        success : function(result) { /* console.log('data Report', result); */ }
      });  
  },

  sendComment : function() {
    var playerid = this.Owner.id
    , token  = this.Owner.toJSON().token
    , gameid = this.gameid
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
    console.log('onClose !');

    this.undelegateEvents();
    
    this.poller.off('success', this.renderList, this);
    this.poller.stop();
  }
});