Y.Views.GameFollow = Y.View.extend({
  el:"#content",

  listview:"#listGamesView",
    
  events: {
    "blur input#search-basic": "search"
  },

  pageName: "gameFollow",
  pageHash : "games/follow",

  initialize:function() {
  
    //header
    Y.GUI.header.title(i18n.t('gamefollow.title'));		    
  
    this.templates = {
      gamelist:  Y.Templates.get('gameList'),
      gamesearch: Y.Templates.get('gameListSearch')
    };
      
	//render immediately
    this.render();   
        
    var games = Y.Conf.get("owner.games.followed");
    	    
    if (games!==undefined) {   
    	this.gameLast = games[games.length-1];     
	    this.collection = new GamesCollection();	    
	    var that = this;	    
	    var i = games.length;
	    
	    this.syncGame = function (game) {	    
		   that.collection.add(game);	      
           i--;         		   
           //si dernier element du tableau
           if (that.gameLast === game.get('id')) {
	    	 $(that.listview).html(that.templates.gamelist({games:that.collection.toJSON(),query:' '}));
	       }			
	     };	    
	    
	    this.games = [];
	    games.forEach(function (gameid,index) {	    
			var game = new GameModel({id : gameid});	        
	        game.once("sync", this.syncGame, this);
	        game.fetch();
	        this.games[index] = game;	
	        			
	    },this);
	 }
	 else {
	   $(this.listview).html(this.templates.gamelist({games:[],query:' '}));
	   $('p.message').i18n();
	 }

  },
  

    
  search:function() {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();

    this.games.setMode('player',q);
    this.games.fetch();
    $(this.listview).html(this.templates.gamelist({games:this.games.toJSON(), query:q}));
    $(this.listview).listview('refresh');
    //}
  
  },

  //render the content into div of view
  render: function(){
    this.$el.html(this.templates.gamesearch(), {});

  },

  renderList: function() {

    $(this.listview).html(this.templates.gamelist({games:this.collection.toJSON(),query:' '}));
    //$(this.listview).listview('refresh');

  },
  
  onClose: function() {
    this.undelegateEvents();

	if (this.games!==undefined) {
		this.games.forEach(function (game) {
		   game.off("sync", this.syncGame, this);
		}, this);
	}
  }
});
