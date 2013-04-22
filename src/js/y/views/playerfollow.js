Y.Views.PlayerFollow = Y.View.extend({
  el:"#content",
  
  events: {
    "blur input#search-basic": "search",
    "click li": "choosePlayer"    
  },

  listview:"#listPlayersView",  
  
  pageName: "playerFollow",
  pageHash : "players/follow",

  initialize:function() {

	//header      
    Y.GUI.header.title("JOUEURS SUIVIS");    

    // loading templates.
    this.templates = {
      playerlist:  Y.Templates.get('playerList'),
      players: Y.Templates.get('players')
    };
    

    this.render();		
       
    var players = Y.Conf.get("owner.players.followed");
    
    //console.log('players',players);
    
    if (players!==undefined) {

	    this.collection = new PlayersCollection();
	
	    var that = this;
	
	    var i = players.length;	
	    players.forEach(function (playerid) {
	
			//console.log('player',playerid);
			
			player = new PlayerModel({id : playerid});
	        
	        player.once("sync", function () { 
	        
	          that.collection.add(this);
	          
	          i--;

	          if (i<=0) {
	    			console.log('renderList',that.collection.toJSON());    
	    			$(that.listview).html(that.templates.playerlist({players:that.collection.toJSON(),query:' '}));  	
	          }
	        });
	        player.fetch();
				
	    });
	 }
	 else {
	 
	   $(this.listview).html(this.templates.playerlist({players:[],query:' '}));
	 }
     
  },
  
  choosePlayer : function(elmt) { 
    var ref = elmt.currentTarget.id;
    console.log(ref);
	Y.Router.navigate(ref, {trigger: true});  
  },  
  
  search:function() {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();    	  
    this.players.setMode('search',q);
    this.players.fetch();
    $(this.listview).html(this.templates.playerlist({players:this.playersfollow.toJSON(), query:q}));
    //$(this.listview).listview('refresh');
    //}
    return this;
  },

  //render the content into div of view
  render: function(){
    this.$el.html(this.templates.players({}));

    return this;
  },

  renderList: function(query) {
    $(this.listview).html(this.templates.playerlist({players:this.collection.toJSON(), query:' '}));

    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    //this.players.off("all",this.renderList,this);   
  }
});