Y.Views.PlayerList = Y.View.extend({
  el : "#content",

  events : {
    "keyup input#search-basic" : "search"
  },

  listview : "#listPlayersView",

  pageName: "playerList",
  pageHash : "players/list", 

  initialize : function() {
  
    Y.GUI.header.title("LISTE DES JOUEURS"); 
    
    console.log('PlayerList View '+this.id);
  
    this.playerListViewTemplate = Y.Templates.get('playerList');
    this.playerSearchTemplate = Y.Templates.get('players');
    
    // we render immediatly
    this.render();    


    if (this.id !== 'null') {
      console.log('on demande les joueurs par club ' + this.id);

      this.players = new PlayersCollection();
      this.players.setMode('club', this.id);
      this.players.on('sync', this.renderList, this);
            
      this.players.fetch();

    }
    
 


  },

  search : function() {
    // FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();
    
    this.players.setMode('search', q);
    this.players.fetch();
    
	try {
	    $(this.listview).html(this.playerListViewTemplate, {
	      players : this.players.toJSON(),
	      query : q
	    });
    }
    catch(e) {
     console.log('error ',e);
    }
    
    $(this.listview).listview('refresh');
    // }
    return this;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.playerSearchTemplate({}));

    return this;
  },

  renderList : function(query) {
    $(this.listview).html(this.playerListViewTemplate({
      players : this.players.toJSON(),
      query : ' '
    }));
    //$(this.listview).listview('refresh');
    return this;
  },

  onClose : function() {
    this.undelegateEvents();
    this.players.off("sync", this.render, this);
  }
});
