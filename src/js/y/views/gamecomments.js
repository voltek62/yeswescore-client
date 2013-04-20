Y.Views.GameComments = Y.View.extend({
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
      layout: Y.Templates.get('gameComments'),
      score:  Y.Templates.get('gameCommentsScore'),
      comment: Y.Templates.get('gameCommentsComment')
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
    this.$(".list-comment-title").html("COMMENTAIRES");
	  return this;
  },
  
  // score component (top of the page)
  renderScore: function () {
	  this.$(".score").html(this.templates.score({game : this.game}));
	  return this;
  },

  // liste de commentaires 
  renderList : function() {
    $listComment = this.$(".list-comment");
    var nbComments = this.streamItemsCollection.length;
    // FIXME: l18n
    if (nbComments === 0)
      this.$(".list-comment-title").html("Aucun commentaires");
    else if (nbComments <= 10)
      this.$(".list-comment-title").html(nbComments + " COMMENTAIRES");
    else
      this.$(".list-comment-title").html("10 DERNIERS COMMENTAIRES");
    //
    this.streamItemsCollection.forEach(function (streamItem) {
      if (!document.getElementById("comment"+streamItem.get('id'))) {
        $listComment.prepend(this.templates.comment({
          streamItem  : streamItem.toJSON(),
          Owner : this.Owner.toJSON()
        }));
      }
    }, this);
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
    console.log('yes');
    /*
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
    */
  },

  onClose: function(){
    console.log('onClose !');

    this.undelegateEvents();
    
    this.poller.off('success', this.renderList, this);
    this.poller.stop();
  }
});