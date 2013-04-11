Y.Views.PlayerFollow = Backbone.View.extend({
  el:"#content",
  
  events: {
    "keyup input#search-basic": "search"
  },

  listview:"#listPlayersView",

  pageName: "playerFollow",
  pageHash : "players/follow",

  initialize:function() {
  
    this.pageHash += this.id; 
    
    Y.GUI.header.title("JOUEURS SUIVIS");    
  
    this.playerListViewTemplate = Y.Templates.get('playerList');
    this.playerSearchTemplate = Y.Templates.get('playerSearch');

    // $.mobile.showPageLoadingMsg();


    this.render();		
        
    console.log('players ',this.playersfollow.toJSON());
        	
    //this.players.on( 'all', this.renderList, this );
    //this.renderList();
    
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