Y.Views.GameFollow = Backbone.View.extend({
  el:"#content",

  listview:"#listGamesView",
    
  events: {
    "keyup input#search-basic": "search"
  },

  pageName: "gameFollow",
  pageHash : "games/follow",

  initialize:function() {
  
    Y.GUI.header.title("LISTE DES PARTIES SUIVIS");		    
  
    this.indexViewTemplate = Y.Templates.get('index');
    this.gameListViewTemplate = Y.Templates.get('gameListView');
       
    this.render();   
        
    var games = Y.Conf.get("owner.games.followed");
    console.log('games',games);
    
    this.games = new GamesCollection();
    games.forEach(function (game) {

		console.log('game',game);
		
		this.score = new GameModel({id : game});
        this.score.fetch();
        this.score.once("all",this.addScore,this);
		//this.games.add(this.score);
			
    });
        


  },
  
  addScore:function() {
  
    console.log("addScore 1 ",this.score);
    
    this.games.add(this.score);
    
    console.log("addScore 2 ",this.games);
    
    this.games.once( 'all', this.renderList, this );    
 
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

  renderList: function(query) {
  
    console.log('renderList',this.games);
    
    $(this.listview).html(this.gameListViewTemplate({games:this.games.toJSON(),query:' '}));
    $(this.listview).listview('refresh');

    return this;
  },
  
  onClose: function() {
    this.undelegateEvents();
    this.games.off("all",this.renderList,this);
  }
});
