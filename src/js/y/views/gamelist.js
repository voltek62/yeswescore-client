Y.Views.GameList = Y.View.extend({
  el: "#content",

  events: {
    // mode "input"
    'focus input[type="search"]': 'inputModeOn',
    'blur input[type="search"]': 'inputModeOff',

    "keyup input#search-basic": "searchOnKey",
    "mousedown .button-search": "searchButton",
    "click li": "goToGame",

    'click .button-filter': 'showFilters',
    'click .filters a[data-filter="date"]': 'filterByDate',
    'click .filters a[data-filter="location"]': 'filterByLocation',    
    'click .filters a[data-filter="club"]': 'filterByClub'
  },

  listview: "#listGamesView",

  pageName: "gameList",
  pageHash : "gameList", 
  
  initialize: function (param) {
  	
	//header 
    if (param!=='undefined') { 
      if (param.mode==="me")
        Y.GUI.header.title("LISTE DE VOS MATCHS");
      else if (param.mode==="club")
        Y.GUI.header.title("LISTE DES MATCHS DU CLUB");   
      else
        Y.GUI.header.title("LISTE DES MATCHS");     
    }
	else
	  Y.GUI.header.title("LISTE DES MATCHS");
	  
	
    var that = this;
    //  
    
    
    this.templates = {
      gamelist:  Y.Templates.get('gameList'),
      gamesearch: Y.Templates.get('gameSearch')
    };
    

    //we capture config from bootstrap
    //FIXME: put a timer
    //this.config = new Config();
    //this.config.fetch();

    // we need to do 2 things 
    // - fetch games
    // - read/create the player
    // THEN
    //  render games & player.

    // first: fetch games
    this.gameDeferred = $.Deferred();
    this.games = new GamesCollection();

    if (param!=='undefined') {
    
    	// Mode : my games, games followed /
	    if (param.mode !== '')
	      this.games.setMode(param.mode,param.id);
	      
	    if (param.sort !== '')
	      this.games.setSort(param.sort);
	      
     }    
      
            
    this.games.on('sync', this.gameDeferred.resolve, this.gameDeferred);
    this.games.fetch();

    // second: read/create player
    var playerDeferred = $.Deferred();
    this.$el.html("please wait, loading player");
    Y.User.getPlayerAsync(function (err, player) {
      if (err) {
        // no player => creating player.
        console.log('error reading player ', err);
        // creating the player.
        Y.User.createPlayerAsync(function (err, player) {
          // FIXME: err, reject deferred
          console.log('player created', player);
          playerDeferred.resolve();
        });
        return;
      }
      playerDeferred.resolve();
    });

    // FIXME: handling error with deferreds
    $.when(
      this.gameDeferred,
      playerDeferred
    ).done(function () {
      that.render();
      that.renderList();
    });
      
  },


  goToGame: function (elmt) {
    if (elmt.currentTarget.id) {
      var route = elmt.currentTarget.id;
      Y.Router.navigate(route, {trigger: true}); 
    }
  },

  showFilters: function () {
    this.$(".filters").show();
  },
  hideFilters: function () {
    this.$(".filters").hide();
  },

/*
<a href="#sort/location" class="button">Afficher par Lieu</a>'
+    +' <a href="#sort/ongoing" class="button">Afficher Matchs encours</a>'
+    +' <a href="#sort/finished" class="button">Afficher Matchs finis</a>
*/
  filterByLocation: function () { this.filter("location");Y.Router.navigate("sort/location", true);},
  filterByDate: function () { this.filter("date");Y.Router.navigate("sort/date", true);},
  filterByClub: function () { this.filter("club");Y.Router.navigate("sort/club", true);},  
  filterByOngoing: function () { this.filter("ongoing");Y.Router.navigate("sort/ongoing", true); },
  filterByFinished: function () { this.filter("finished");Y.Router.navigate("sort/finished", true); },

  filter: function (o) {
    // FIXME
    console.log('FIXME: filter by ' + o);
    this.hideFilters();
  },

  searchButton: function () {
    this.inputModeOff();
    this.search();
  },

  searchOnKey: function (event) {
    if(event.keyCode == 13){
      // the user has pressed on ENTER
      this.search();
    }
    return this;
  },

  search: function () {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).html('<p class="message">Aucun resultat</p>'); // FIXME: no html in code.
    this.games.setMode('player');
    this.games.setQuery(q);
    this.games.fetch().done($.proxy(function () {
      $(this.listview).html(this.templates.gamelist({ games: this.games.toJSON(), query: q }));
    }, this));
    return this;
  },

  // should not take any parameters
  render: function () {
    this.$el.html(this.templates.gamesearch(), {});
    return this;
  },

  // should not take any parameters
  renderList: function () {
    $(this.listview).html(this.templates.gamelist({ games: this.games.toJSON(), query: ' ' }));
    return this;
  },

  onClose: function () {
    this.undelegateEvents();
    //this.games.off("all", this.renderList, this);
    this.games.off('sync', this.gameDeferred.resolve, this.gameDeferred);
  }
});