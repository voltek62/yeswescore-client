var PlayerListView = Backbone.View.extend({
  el : "#content",

  events : {
    "keyup input#search-basic" : "search"
  },

  listview : "#listPlayersView",

  pageName: "playerList",

  initialize : function() {
  
    $.ui.scrollToTop('#content'); 
  
  	$.ui.setBackButtonVisibility(true);
    $.ui.setBackButtonText("&lt;");
    $.ui.setTitle("LISTE DES JOUEURS");
  
    this.playerListViewTemplate = Y.Templates.get('playerListViewTemplate');
    this.playerSearchTemplate = Y.Templates.get('playerSearchTemplate');
    //$.mobile.showPageLoadingMsg();

    if (this.id !== 'null') {
      console.log('on demande les joueurs par club ' + this.id);

      this.players = new PlayersCollection();
      this.players.setMode('club', this.id);
      this.players.fetch();
      this.players.on('all', this.renderList, this);
    }
    this.render();
    // this.renderList();
    //$.mobile.hidePageLoadingMsg();
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
    
    }
    
    $(this.listview).listview('refresh');
    // }
    return this;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.playerSearchTemplate({}));
    // Trigger jquerymobile rendering
    //this.$el.trigger('pagecreate');
    // return to enable chained calls
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
    this.players.off("all", this.render, this);
  }
});
