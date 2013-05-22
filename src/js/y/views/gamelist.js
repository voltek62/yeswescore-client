Y.Views.GameList = Y.View.extend({
  el: "#content",

  events: {
    // mode "input"
    "keyup input#search-basic": "searchOnKey",
    "mousedown .button-search": "searchButton",
    "click li": "goToGame",
    'click .button-option-down': 'showFilters',
    
    'click a[data-filter="match-geo"]': 'searchWithGeo',
    'click a[data-filter="match-followed"]': 'searchWithFollowed',    
    'click a[data-filter="match-club"]': 'searchWithClub',
        
    'click a[data-filter="filter-date"]': 'filterByDate',
    'click a[data-filter="filter-location"]': 'filterByLocation',    
    'click a[data-filter="filter-status"]': 'filterByStatus'
  },

  listview: "#listGamesView",

  pageHash : "games/list",

  sortOption: "",
  searchOption: "",  
  clubid: "",
      
  myinitialize: function (param) {
  	
  	//FIXME: refacto
  	this.sortOption = Y.User.getFilters();
  	this.searchOption = Y.User.getSearchBy();
  	this.clubid = Y.User.getClub();
  	
	//header 
    if (param!=='undefined') { 
      if (param.mode==="me") {
        Y.GUI.header.title(i18n.t('gamelist.titleyourgames'));
        this.pageName = "gameListByMe";
      }
      else if (param.mode==="club") {
        Y.GUI.header.title(i18n.t('gamelist.titleclubsgames')); 
        this.pageName = "gameListByClub";        
      }  
      else {
        Y.GUI.header.title(i18n.t('gamelist.titlegames'));  
        this.pageName = "gameList";
      }  
    }
	else {
	  Y.GUI.header.title(i18n.t('gamelist.titlegames'));
      this.pageName = "gameList";	  
    }
	
    var that = this;
    //  
    
    
    this.templates = {
      gamelist:  Y.Templates.get('gameList'),
      gamesearch: Y.Templates.get('gameListSearch'),
      error: Y.Templates.get('error')      
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
    
	    if (param.search !== '')
	      this.games.setSearch(param.search,param.id);
	      
	    if (param.sort !== '') {
	      this.games.setSort(param.sort);
		  this.sortOption = param.sort;  	  
	    }
	      
     }    
      
            
    this.games.on('sync', this.gameDeferred.resolve, this.gameDeferred);
    this.games.fetch();

    // second: read/create player
    var playerDeferred = $.Deferred();
    this.$el.html("<span style=\"top:50px\">"+i18n.t('message.noconnection')+"</span>");
    Y.User.getPlayerAsync(function (err, player) {
      if (err) {
        // no player => creating player.
        //console.log('error reading player ', err);
        // creating the player.
        Y.User.createPlayerAsync(function (err, player) {
          // FIXME: err, reject deferred
          //console.log('player created', player);
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

  
  searchWithGeo: function () {   	
  	this.setSearch("geolocation");
  	Y.User.setSearchBy('geo');
  	//Y.Router.navigate("sort/date", true);
  },
  
  searchWithFollowed: function () {   	
  	this.setSearch("followed");
  	Y.User.setSearchBy('followed');
  	//Y.Router.navigate("sort/date", true);
  },
  
  searchWithClub: function () {   	
  	this.setSearch("club");
  	Y.User.setSearchBy('club');
  	//Y.Router.navigate("sort/date", true);
  }, 
  
  filterByLocation: function () { 
    this.setSort("location");
  	Y.User.setFilters('location');    
    Y.Router.navigate("sort/location", true);
  },     
  
  filterByDate: function () {   	
  	this.setSort("date");
  	Y.User.setFilters('date');
  	Y.Router.navigate("sort/date", true);
  },
   
  filterByStatus: function () { 
    this.setSort("status");
  	Y.User.setFilters('status');
    Y.Router.navigate("sort/status", true); 
  },
  
  filterByFinished: function () { 
    this.setSort("finished");    
  	Y.User.setFilters('finished');
    Y.Router.navigate("sort/finished", true); 
  },

  setSort: function (o) {
    // FIXME
    
	if (this.sortOption==='date') 
      $('.filters #filter-date').addClass('select');
 	else if (this.sortOption==='location') 
  	  $('.filters #filter-location').addClass('select'); 
 	else if (this.sortOption==='club') 
      $('.filters #filter-status').addClass('select');  
          
    //console.log('FIXME: filter by ' + o);
    this.sortOption = o;
    this.hideFilters();
  },

  setSearch: function (o) {
    // FIXME
    
	if (this.searchOption==='geo') 
      $('.filters #match-geo').addClass('select');
 	else if (this.searchOption==='followed') 
  	  $('.filters #match-followed').addClass('select'); 
 	else if (this.searchOption==='club') 
      $('.filters #match-club').addClass('select'); 
      
          
    //console.log('FIXME: filter by ' + o);
    this.searchOption = o;
    this.hideFilters();
  },

  searchButton: function () {
    this.inputModeOff();
    this.searchOption();
  },

  searchOnKey: function (event) {
    if(event.keyCode == 13){
      // the user has pressed on ENTER
      this.searchOption();
    }
    return this;
  },

  search: function () {
    var q = $("#search-basic").val();
    $(this.listview).html(this.templates.error());
    $('p').i18n(); 
    this.games.setMode('player');
    this.games.setQuery(q);
    this.games.fetch().done($.proxy(function () {    
      $(this.listview).html(this.templates.gamelist({ games: this.games.toJSON(), query: q }));
    }, this));
    
    return this;
  },

  // should not take any parameters
  render: function () {
    this.$el.html(this.templates.gamesearch({}));   
    $('a').i18n();    

	if (this.searchOption==='geo') 
      $('.filters #match-geo').addClass('select');
 	else if (this.searchOption==='followed') 
  	  $('.filters #match-followed').addClass('select'); 
 	else if (this.searchOption==='club') 
      $('.filters #match-club').addClass('select'); 
	      
	if (this.sortOption==='date') 
      $('.filters #filter-date').addClass('select');
 	else if (this.sortOption==='location') 
  	  $('.filters #filter-location').addClass('select'); 
 	else if (this.sortOption==='club') 
      $('.filters #filter-status').addClass('select');      
      
    if (this.clubid === undefined ) {
    	$('.filters #match-club').prop("disabled", true);
    }
    
    return this;
  },

  // should not take any parameters
  renderList: function () {
    $(this.listview).html(this.templates.gamelist({ games: this.games.toJSON(), query: ' ' }));
    $('p.message').i18n();
    return this;
  },

  onClose: function () {
    this.undelegateEvents();
    this.games.off('sync', this.gameDeferred.resolve, this.gameDeferred);
  }
});