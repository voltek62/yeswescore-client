var GameListView = Backbone.View.extend({
  el:"#content",
    
  events: {
      "keyup input#search-basic": "search"
  },

  listview:"#listGamesView",
  
  pageName: "gameList",
  pageHash : "#index",

  mode:'',

  initialize: function(data) {
  
    $.ui.scrollToTop('#content'); 
    
    $.ui.setBackButtonVisibility(true);
    $.ui.setBackButtonText("&lt;");
    $.ui.setTitle("LISTE DES PARTIES");	    
  
    this.gameListTemplate = Y.Templates.get('gameListTemplate');
    this.gameListViewTemplate = Y.Templates.get('gameListViewTemplate');
    
    //$.mobile.showPageLoadingMsg();
        
    console.log('gamelist mode ', data);
        
    if (data.mode==='club') {
      this.games = new GamesCollection();
      this.games.setMode('clubid',data.clubid);	
    } else if (data.mode==='me') {
      this.games = new GamesCollection();
      this.games.setMode('me',data.id);	
    } else {
      this.games = new GamesFollow();
    }
        	
    this.mode = data.mode;
        
    this.games.fetch();

    this.render();
        
    this.games.on("all", this.renderList, this);
        
    //$.mobile.showPageLoadingMsg();
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
    $(this.listview).html(this.gameListViewTemplate({games:this.games.toJSON(),query:q}));
    $(this.listview).listview('refresh');
    //}
    return this;
  },

  //render the content into div of view
  render: function(){
    this.$el.html(this.gameListTemplate({mode:this.mode}));
    //Trigger jquerymobile rendering
    //this.$el.trigger('pagecreate');
    //return to enable chained calls
    return this;
  },

  renderList: function(query) {
    console.log('renderList');
    
    $(this.listview).html(this.gameListViewTemplate({games:this.games.toJSON(),query:' '}));
    $(this.listview).listview('refresh');
    //$.mobile.hidePageLoadingMsg();
    return this;
  },
  
  onClose: function(){
    this.undelegateEvents();
    this.games.off("all",this.renderList,this);
  }
});