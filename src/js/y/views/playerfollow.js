Y.Views.PlayerFollow = Y.View.extend({
  el:"#content",
  
  events: {
    "keyup input#search-basic": "search"
  },

  listview:"#listPlayersView",

  pageName: "playerFollow",
  pageHash : "players/follow",

  initialize:function() {
      
    Y.GUI.header.title("JOUEURS SUIVIS");    

    this.playerSearchTemplate = Y.Templates.get('playerSearch');  
    this.playerListViewTemplate = Y.Templates.get('playerList');

    this.render();		
        
    var players = Y.Conf.get("owner.players.followed");
    this.collection = new PlayersCollection();
    
    var that = this;
    
    var i = players.length;
    players.forEach(function (gameid) {

		console.log('game',gameid);
		
		player = new PlayerModel({id : gameid});
        player.fetch();
        player.once("all", function () { 
          that.collection.add(player);
          i--;
          
          console.log('i',i);
          
          if (i<=0) {

    			console.log('renderList',that.collection.toJSON());
    
    			$(that.listview).html(that.playerListViewTemplate({players:that.collection.toJSON(),query:' '}));
    	
          }
        });
			
    });
        
  },
  
  search:function() {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();    	  
    this.players.setMode('search',q);
    this.players.fetch();
    $(this.listview).html(this.playerListViewTemplate({players:this.playersfollow.toJSON(), query:q}));
    $(this.listview).listview('refresh');
    //}
  },

  //render the content into div of view
  render: function(){
    this.$el.html(this.playerSearchTemplate({}));
    //Trigger jquerymobile rendering
    //this.$el.trigger('pagecreate');
    //return to enable chained calls
    return this;
  },

  renderList: function(query) {
    $(this.listview).html(this.playerListViewTemplate({players:this.playersfollow.toJSON(), query:' '}));
    $(this.listview).listview('refresh');
    //$.mobile.hidePageLoadingMsg();
    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    //this.players.off("all",this.renderList,this);   
  }
});