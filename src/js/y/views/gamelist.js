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
  	this.sortOption = Y.User.getFiltersSort();
  	this.searchOption = Y.User.getFiltersSearch();
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
      error: Y.Templates.get('error'),
      ongoing: Y.Templates.get('ongoing')      
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
    
	    if (param.search !== '') {
	      this.games.setSearch(param.search,param.id);
		  this.searchOption = param.search;  	      
	    }
	    
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
  },
  
  searchWithFollowed: function () {   	
  	this.setSearch("followed");
  },
  
  searchWithClub: function () {   	
  	if (this.clubid !== "") {
	  	this.setSearch("club");
	}
  }, 
  
  filterByLocation: function () { 
    this.setSort("location");
  },     
  
  filterByDate: function () {   	
  	this.setSort("date");	
  },
   
  filterByStatus: function () { 
    this.setSort("live");
  },
  

  setSort: function (o) {
  
     $(".filters a[class*='#filter-']").hide();
     
	if (this.sortOption==='date') 
      $('.filters #filter-date').addClass('select');
 	else if (this.sortOption==='location') 
  	  $('.filters #filter-location').addClass('select'); 
 	else if (this.sortOption==='live') 
      $('.filters #filter-status').addClass('select');  
          
    //console.log('FIXME: filter by ' + o);
    this.sortOption = o;   
    Y.User.setFiltersSort(o);
    this.search();     
    this.hideFilters();
  },

  setSearch: function (o) {
    // FIXME
    
	if (this.searchOption==='geolocation') 
      $('.filters #match-geo').addClass('select');
 	else if (this.searchOption==='followed') 
  	  $('.filters #match-followed').addClass('select'); 
 	else if (this.searchOption==='club') 
      $('.filters #match-club').addClass('select'); 
      
    this.searchOption = o;  
    Y.User.setFiltersSearch(o);         
    this.search();    
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
    var q = $("#search-basic").val();
    $(this.listview).html(this.templates.ongoing());
    $('p').i18n(); 
    
    if (this.sortOption !=="") 
      this.games.setSort(this.sortOption);  
    
    /*
    if (this.searchOption !=="")     
      this.games.setSearch(this.searchOption,this.clubid);    
    else 
    	this.games.setSearch('player');
    */
    
    //FIXME: on passe option de recherche
    //this.games.setQuery(q);
    
    this.games.fetch().done($.proxy(function () {    
    
      //FIXME si nul, on affiche pas de resultat
    
      $(this.listview).html(this.templates.gamelist({ games: this.games.toJSON(), query: q }));
    }, this));
    
    return this;
  },

  // should not take any parameters
  render: function () {
    this.$el.html(this.templates.gamesearch({}));   
    $('a').i18n();    

	if (this.searchOption==='geo') 
      $('.filters #filter-match-geo').addClass('select');
 	else if (this.searchOption==='followed') 
  	  $('.filters #filter-match-followed').addClass('select'); 
 	else if (this.searchOption==='club') 
      $('.filters #filter-match-club').addClass('select'); 
	      
	if (this.sortOption==='date') 
      $('.filters #filter-date').addClass('select');
 	else if (this.sortOption==='location') 
  	  $('.filters #filter-location').addClass('select'); 
 	else if (this.sortOption==='status') 
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