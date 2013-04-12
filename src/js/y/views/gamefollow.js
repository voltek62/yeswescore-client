Y.Views.GameFollow = Y.View.extend({
  el:"#content",

  listview:"#listGamesView",
    
  events: {
    "keyup input#search-basic": "search"
  },

  pageName: "gameFollow",
  pageHash : "games/follow",

  initialize:function() {
  
    Y.GUI.header.title("MATCHS SUIVIS");		    
  
    this.indexViewTemplate = Y.Templates.get('games');
    this.gameListViewTemplate = Y.Templates.get('gameListView');
       
    this.render();   
        
    var games = Y.Conf.get("owner.games.followed");
    this.collection = new GamesCollection();
    
    var that = this;
    
    var i = games.length;
    games.forEach(function (gameid) {

		console.log('game',gameid);
		
		game = new GameModel({id : gameid});
        game.fetch();
        game.once("all", function () { 
          that.collection.add(game);
          i--;
          
          console.log('i',i);
          
          if (i<=0) {

    			console.log('renderList',that.collection.toJSON());
    
    			$(that.listview).html(that.gameListViewTemplate({games:that.collection.toJSON(),query:' '}));
    	;
          }
        });
			
    });

  },
  

    
  search:function() {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();
    //gamesList = new GamesSearch();
    //gamesList.setQuery(q);
    //gamesList.fetch();
    this.games.setMode('player',q);
    this.games.fetch();
    $(this.listview).html(this.gameListViewTemplate({games:this.games.toJSON(), query:q}));
    $(this.listview).listview('refresh');
    //}
    return this;
  },

  //render the content into div of view
  render: function(){
    this.$el.html(this.indexViewTemplate(), {});
    //Trigger jquerymobile rendering
    //this.$el.trigger('pagecreate');
      
    //return to enable chained calls
    return this;
  },

  renderList: function() {
  
    console.log('renderList',this.collection);
    
    $(this.listview).html(this.gameListViewTemplate({games:this.collection.toJSON(),query:' '}));
    $(this.listview).listview('refresh');

    return this;
  },
  
  onClose: function() {
    this.undelegateEvents();
    //this.games.off("all",this.renderList,this);
  }
});
