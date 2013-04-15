Y.Views.PlayerFollow = Y.View.extend({
  el:"#content",
  
  listview:"#listPlayersView",  
  
  events: {
    "keyup input#search-basic": "search"
  },

  pageName: "playerFollow",
  pageHash : "players/follow",

  initialize:function() {
      
    Y.GUI.header.title("JOUEURS SUIVIS");    

    this.playerSearchTemplate = Y.Templates.get('players');  
    this.playerListViewTemplate = Y.Templates.get('playerList');

    this.render();		
        
    var players = Y.Conf.get("owner.players.followed");
    this.collection = new PlayersCollection();
    
    var that = this;
    
    var i = players.length;
    players.forEach(function (playerid) {

		console.log('player',playerid);
		
		player = new PlayerModel({id : playerid});
        player.fetch();
        player.once("sync", function () { 
        
          that.collection.add(this);
          console.log('add player',this.toJSON());           
          
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
    return this;
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
    $(this.listview).html(this.playerListViewTemplate({players:this.collection.toJSON(), query:' '}));
    $(this.listview).listview('refresh');
    //$.mobile.hidePageLoadingMsg();
    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    //this.players.off("all",this.renderList,this);   
  }
});