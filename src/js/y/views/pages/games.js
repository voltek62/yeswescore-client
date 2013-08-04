Y.Views.Pages.GameList = Y.View.extend({
  el: "#content",

  events: {
    // mode "input"
    "keyup input#search-basic": "searchOnKey",
    "blur input#search-basic": "searchOnBlur",
    "mousedown .button-search": "searchButton",
    "vclick li": "goToGame",
    'click .button-option-right': 'showFilters',
   
    'vclick a[data-filter="searchmyclub"]':'deleteFilter', 
    'vclick a[data-filter="searchgeo"]':'deleteFilter',    
        
    'click div[data-filter="filter-status-all"]': 'filterByStatusAll',
    'click div[data-filter="filter-status-ongoing"]': 'filterByStatusOngoing',    
    'click div[data-filter="filter-status-finished"]': 'filterByStatusFinished',      
    'click div[data-filter="filter-status-created"]': 'filterByStatusCreated'
    
  },

  listview: "#listGamesView",

  pageHash : "games/list",

  sortOption: "",
 
  clubid: "",
  
  controlTimeout: null,
  player: null,
  
  button: true,

  myinitialize: function (param) {
    var that = this;

    // saving parameter
    this.param = param || {};

    // initialization
    this.initializeTitle(param);
    this.initializePageName(param);

    // options
  	this.sortOption = Y.User.getFiltersSort();
  	this.clubid = Y.User.getClub();

    //
    this.onResume = function () { that.search(); };
    
    this.templates = {
      gamelist:  Y.Templates.get('gameList'),
      page: Y.Templates.get('page-games'),
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

    if (param!==undefined) { 
	    if (param.search === 'me') {
	      this.games.addSearch('player');	
	      this.games.setPlayer(this.player.id);		      
	    }
	    else if (param.search === 'player') {
	      this.games.addSearch('player');	
	      this.games.setPlayer(param.id);		        
	    }	    
	    else
	      this.searchOption = Y.User.getFiltersSearch();     
     }
     else 
       	this.searchOption = Y.User.getFiltersSearch();    

     if (this.sortOption!==undefined) {
       if (this.sortOption !=="") 
         this.games.setSort(this.sortOption);      
     }
     
     if (this.searchOption!==undefined) {
     
      if(this.searchOption.indexOf('searchmyclub')!==-1) {       
        
        if (this.clubid !== '') {
          this.games.addSearch('club'); 
          this.games.setClub(this.clubid);
        }
        else {
          this.games.removeSearch('searchmyclub');
          $('#searchmyclub').html('');        
        } 
        
	  }
      
	  if(this.searchOption.indexOf('searchgeo')!==-1) {

        if (Y.Geolocation.longitude!==null && Y.Geolocation.latitude!==null ) {
          this.games.setPos([Y.Geolocation.longitude, Y.Geolocation.latitude]);
          this.games.addSearch('geo');  
        }
        else {
          this.games.removeSearch('searchgeo');
          $('#searchgeo').html('');
        }
        
      }  
      
      //On regarde si la barre de recherche avancé est encore utile
      this.searchOption = Y.User.getFiltersSearch();

      if (this.searchOption!==undefined) 
        $('.advancedsearch').hide();
      else if (this.searchOption.length<=0) 
        $('.advancedsearch').hide();      

           
     }
      
            
    this.games.on('sync', this.gameDeferred.resolve, this.gameDeferred);
    //disable
    this.games.fetch();

    // chargement player
    var playerDeferred = $.Deferred();
    Y.User.getOrCreatePlayerAsync(function (err, player) {
      document.addEventListener("resume", that.onResume, true);
      that.player = player;
      playerDeferred.resolve();
    });

    this.startControlTimeout();

    //
    $.when(
      this.gameDeferred,
      playerDeferred
    ).done(function () {
      this.stopControlTimeout();
      that.render();
    });
  },

  initializeTitle: function (param) {
    var search = (param) ? param.search : null

    switch (search) {
      case 'me':
        Y.GUI.header.title(i18n.t('gamelist.titleyourgames'));
        this.button=false; // FIXME: render ?
        break;
      case 'player':
        Y.GUI.header.title(i18n.t('gamelist.titleplayergames'));
        this.button=false; // FIXME: render ?  
        break;
      case 'club':
        Y.GUI.header.title(i18n.t('gamelist.titleclubsgames'));
        break;
      default:
        Y.GUI.header.title(i18n.t('gamelist.titlegames'));
        break;
    }
  },

  initializePageName: function (param) {
    var search = (param) ? param.search : "none";

    switch (search) {
      case 'me':
        this.pageName = "gameListByMe";
        break;
      case 'player':
        this.pageName = "gameListPlayer";
        break;
      case 'club':
        this.pageName = "gameListByClub";
        break;
      default:
        this.pageName = "gameList";
        break;
    }
  },

  // active un message d'erreur si stop n'est pas appelé avant un certain delai
  startControlTimeout: function () {
    if (this.controlTimeout == null) {
      this.controlTimeout = window.setTimeout(function () {
        that.$el.html("<span style=\"top:50px\">"+i18n.t('message.noconnection')+"</span>");
        that.controlTimeout = null;
      }, 10000);
    }
  },

  stopControlTimeout: function () {
    if (that.controlTimeout) {
      window.clearTimeout(that.controlTimeout);
      that.controlTimeout = null;
    }
  },

  deleteFilter : function (event) {
    
    var cmd = event.currentTarget.id;
    
	if (cmd==='searchgeoselect') { 
      Y.User.setFiltersSearch('searchgeo');
      $('#searchgeo').html('');
      this.games.removeSearch('geo');
    }   

	if (cmd==='searchmyclubselect') { 
      Y.User.setFiltersSearch('searchmyclub');
      $('#searchmyclub').html('');
      this.games.removeSearch('club');
    } 
    
    var filters = Y.User.getFiltersSearch();
    
    if (filters===undefined) 
      $('.advancedsearch').hide();
    else if (filters.length<=0) 
      $('.advancedsearch').hide();
      
    this.search();  
      
  },  
  
  goToGame: function (elmt) {
    if (elmt.currentTarget.id) {
      var route = elmt.currentTarget.id;
      Y.Router.navigate(route, {trigger: true}); 
    }
  },

  showFilters: function () {
    
    //this.$('.button-option-down').addClass('button-option-up').removeClass('button-option-down');
    //this.$(".filters").show();
    Y.Router.navigate("search/form", {trigger: true}); 
    
  },
  hideFilters: function () {

    this.$('.button-option-up').addClass('button-option-down').removeClass('button-option-up');   
    
    $('.message').removeAttr('style');
    
    this.$(".filters").hide();
      
  },

 
   
  filterByStatusAll: function () { 
    this.setSort("all");
  },
  
  filterByStatusOngoing: function () { 
    this.setSort("ongoing");
  },
  
  filterByStatusFinished: function () { 
    this.setSort("finished");
  },
  
  filterByStatusCreated: function () { 
    this.setSort("created");
  },
      
  setSort: function (o) {
  
     $(".search div[data-filter*='filter-status'] span").removeClass('select');
     
	if (o==='all') 
      $(".search div[data-filter='filter-status-all'] span").addClass('select');
 	else if (o==='ongoing') 
  	  $(".search div[data-filter='filter-status-ongoing'] span").addClass('select'); 
 	else if (o==='finished') 
      $(".search div[data-filter='filter-status-finished'] span").addClass('select'); 
 	else if (o==='created') 
      $(".search div[data-filter='filter-status-created'] span").addClass('select');        
          
    this.sortOption = o;   
    Y.User.setFiltersSort(o);
    this.search();     
    //this.hideFilters();
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

  searchOnBlur: function (event) {

    this.search();

    return this;
  },
  
  search: function () {
    var q = $("#search-basic").val();
    $(this.listview).html(this.templates.ongoing());
    $('p').i18n(); 
    
    if (this.sortOption !=="") 
      this.games.setSort(this.sortOption);  
    

    if (this.searchOption !== undefined) {     
      
      //FIXME : cumul search et trier par date
      
      if(this.searchOption.indexOf('searchmyclub')!==-1 && this.clubid === '') {
        this.games.addSearch('club');  
        this.games.setClub(this.clubid);
	  }
      
      if(this.searchOption==="searchgeo" && Y.Geolocation.longitude!==null && Y.Geolocation.latitude!==null) {
        this.games.addSearch('geo');          
        this.games.setPos([Y.Geolocation.longitude, Y.Geolocation.latitude]);
      }  
    
    }  
   
    if (q !== '') {
      this.games.addSearch('player');   
      this.games.setQuery(q);
    }
    else
      this.games.removeSearch('player');

    this.games.fetch().done($.proxy(function () {    
    
      if (this.games.toJSON().length === 0) {
        $(this.listview).html(this.templates.error());
      }
      else {
      
        var games_follow = Y.Conf.get("owner.games.followed");
        var players_follow = Y.User.getPlayer().get('following');
    	//$(this.listview).html(this.templates.gamelist({ games: this.games.toJSON(), games_follow : games_follow, query: ' ' }));
      
        $(this.listview).html(this.templates.gamelist({ games: this.games.toJSON(), games_follow : games_follow, players_follow : players_follow, query: q }));
        
      }
    	
      $(this.listview).i18n();
    
    }, this));
    
    return this;
  },

  // should not take any parameters
  render: function () {
    this.$el.html(this.templates.page({button: this.button})).i18n();
    
    // dynamic stuff.
    var sortOption = this.sortOption || "all";
    $(".search div[data-filter='filter-status-" + sortOption + "] span").addClass('select');             
    
    var filters = Y.User.getFiltersSearch();

    if (filters===undefined) 
      $('.advancedsearch').hide();
    else if (filters.length<=0) 
      $('.advancedsearch').hide(); 
    else {     
      	if (filters.indexOf('searchgeo')!==-1) {
     	  $('#searchgeo').html('<a data-filter="searchgeo" id="searchgeoselect">'+i18n.t('search.filtergps')+'</a>');	
	    } 
	    else
	      $('#searchgeo').html('');	
	    
	    if (filters.indexOf('searchmyclub')!==-1) {
		  $('#searchmyclub').html('<a data-filter="searchmyclub" id="searchmyclubselect">'+i18n.t('search.filtermyclub')+'</a>');	
	 	}
	 	else
	 	  $('#searchmyclub').html('');	
    }
    
    var games_follow = Y.Conf.get("owner.games.followed");
    var players_follow = Y.User.getPlayer().get('following');
    
    $(this.listview).html(this.templates.gamelist({ games: this.games.toJSON(), games_follow : games_follow, players_follow : players_follow, query: ' ' }));
    $('p.message').i18n();
    return this;
  },

  onClose: function () {
    if (this.button===false) { 
	    this.games.removeSearch('me');	
    }
	
    this.stopControlTimeout();
	
	  document.removeEventListener("resume", this.onResume, true);
    
    this.games.off('sync', this.gameDeferred.resolve, this.gameDeferred);
  }
});