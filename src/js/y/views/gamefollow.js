Y.Views.GameFollow = Y.View.extend({
  el:"#content",

  listview:"#listGamesView",
    
  events: {
    "blur input#search-basic": "search"
  },

  pageName: "gameFollow",
  pageHash : "games/follow",

  initialize:function() {
  
    Y.GUI.header.title("MATCHS SUIVIS");		    
  
    this.indexViewTemplate = Y.Templates.get('games');
    this.gameListViewTemplate = Y.Templates.get('gameList');
       
    this.render();   
        
    var games = Y.Conf.get("owner.games.followed");
    
    if (games!==undefined) {
    
	    this.collection = new GamesCollection();
	    
	    var that = this;
	    
	    var i = games.length;
	    games.forEach(function (gameid) {
	
			//console.log('game',gameid);
			
			game = new GameModel({id : gameid});
	        
	        game.once("sync", function () {
	         
	          that.collection.add(this);
	          //console.log('add game',this.toJSON());             
	          
	          i--;         
	          //console.log('i',i);
	     
	          if (i<=0) {
	    			console.log('renderList',that.collection.toJSON());   
	    			$(that.listview).html(that.gameListViewTemplate({games:that.collection.toJSON(),query:' '}));
	          }
	        });
	        game.fetch();
				
	    });
	 }
	 else {
	   $(this.listview).html(this.gameListViewTemplate({games:[],query:' '}));
	 }

  },
  

    
  search:function() {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();

    this.games.setMode('player',q);
    this.games.fetch();
    $(this.listview).html(this.gameListViewTemplate({games:this.games.toJSON(), query:q}));
    $(this.listview).listview('refresh');
    //}
  
  },

  //render the content into div of view
  render: function(){
    this.$el.html(this.indexViewTemplate(), {});

  },

  renderList: function() {

    $(this.listview).html(this.gameListViewTemplate({games:this.collection.toJSON(),query:' '}));
    $(this.listview).listview('refresh');

  },
  
  onClose: function() {
    this.undelegateEvents();
    //this.games.off("all",this.renderList,this);
  }
});
