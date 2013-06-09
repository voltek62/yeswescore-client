Y.Views.GameList = Y.View.extend({
  el: "#content",

  events: {
    // mode "input"
    "keyup input#search-basic": "searchOnKey",
    "mousedown .button-search": "searchButton",
    "click li": "goToGame",
    'click .button-option-right': 'showFilters',
   
    'click a[data-filter="searchmyclub"]':'deleteFilter', 
    'click a[data-filter="searchgeo"]':'deleteFilter',    
        
    'click div[data-filter="filter-status-all"]': 'filterByStatusAll',
    'click div[data-filter="filter-status-ongoing"]': 'filterByStatusOngoing',    
    'click div[data-filter="filter-status-finished"]': 'filterByStatusFinished',      
    'click div[data-filter="filter-status-created"]': 'filterByStatusCreated'
    
  },

  listview: "#listGamesView",

  pageHash : "games/list",

  sortOption: "",
 
  clubid: "",
  
  button : true,
      
  myinitialize: function (param) {
  	
  	//FIXME: refacto
  	this.sortOption = Y.User.getFiltersSort();

  	this.clubid = Y.User.getClub();
  	
  	console.log('clubid ',this.clubid);
  	
	//header 
    if (param!=='undefined') { 
      if (param.search==="me") {
        Y.GUI.header.title(i18n.t('gamelist.titleyourgames'));
        this.pageName = "gameListByMe";
        this.button=false;
      }
      else if (param.search==="club") {
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


    if (param!==undefined) { 
	    if (param.search === 'me') {
	      this.games.addSearch('me');	
	      this.player = Y.User.getPlayer();
	      this.playerid = this.player.id;
	      this.games.setQuery(this.playerid);	      
	    }
	    else
	      this.searchOption = Y.User.getFiltersSearch();     
     }
     else 
       	this.searchOption = Y.User.getFiltersSearch();    
  
     
     if (this.searchOption!==undefined) {
     
      if(this.searchOption.indexOf('searchmyclub')!==-1) {       
        
        if (this.clubid !== '') {
          this.games.addSearch('club'); 
          this.games.setClub(this.clubid);
        }
        else {
          Y.User.removeSearch('searchmyclub');
          $('#searchmyclub').html('');        
        } 
        
	  }
      
	  if(this.searchOption.indexOf('searchgeo')!==-1) {

        if (Y.Geolocation.longitude!==null && Y.Geolocation.latitude!==null ) {
          this.games.setPos([Y.Geolocation.longitude, Y.Geolocation.latitude]);
          this.games.addSearch('geo');  
        }
        else {
          Y.User.removeSearch('searchgeo');
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

    // second: read/create player
    var playerDeferred = $.Deferred();
    this.$el.html("<span style=\"top:50px\">"+i18n.t('message.noconnection')+"</span>");
    Y.User.getPlayerAsync(function (err, player) {
      if (err) {
        // no player => creating player.
    
        // creating the player.
        Y.User.createPlayerAsync(function (err, player) {
          // FIXME: err, reject deferred
         
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

  search: function () {
    var q = $("#search-basic").val();
    $(this.listview).html(this.templates.ongoing());
    $('p').i18n(); 
    
    console.log('gamelist search avec sortOption',this.sortOption);
    console.log('gamelist search avec searchOption',this.searchOption);       
    
    if (this.sortOption !=="") 
      this.games.setSort(this.sortOption);  
    

      console.log('search clubid ',this.clubid);
      console.log('this.searchOption.indexOf(searchmyclub) ',this.searchOption.indexOf('searchmyclub'));
    
    if (this.searchOption !== undefined) {     
      
      //FIXME : cumul search et trier par date

      
      if(this.searchOption.indexOf('searchmyclub')!==-1 && this.clubid === '') {
        console.log('gamelist searchmyclub');
        this.games.addSearch('club');  
        this.games.setClub(this.clubid);
	  }
      
      if(this.searchOption==="searchgeo" && Y.Geolocation.longitude!==null && Y.Geolocation.latitude!==null) {
        console.log('gamelist searchgeo');
        this.games.addSearch('geo');          
        this.games.setPos([Y.Geolocation.longitude, Y.Geolocation.latitude]);
      }  
    
    }  
   
    if (q !== '') {
      this.games.addSearch('player');   
      this.games.setQuery(q);
    }

    this.games.fetch().done($.proxy(function () {    
    
      if (this.games.toJSON().length === 0) {
        $(this.listview).html(this.templates.error());
      }
      else
        $(this.listview).html(this.templates.gamelist({ games: this.games.toJSON(), query: q }));
    	
      $(this.listview).i18n();
    
    }, this));
    
    return this;
  },

  // should not take any parameters
  render: function () {
    this.$el.html(this.templates.gamesearch({ button:this.button }));   
    //$('a').i18n(); 
    this.$el.i18n();   
  

	if (this.sortOption==='ongoing') 
  	  $(".search div[data-filter='filter-status-ongoing'] span").addClass('select'); 
 	else if (this.sortOption==='finished') 
      $(".search div[data-filter='filter-status-finished'] span").addClass('select'); 
 	else if (this.sortOption==='created') 
      $(".search div[data-filter='filter-status-created'] span").addClass('select');  
    else
      $(".search div[data-filter='filter-status-all'] span").addClass('select');
            
 
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
    
    return this;
  },

  // should not take any parameters
  renderList: function () {
    $(this.listview).html(this.templates.gamelist({ games: this.games.toJSON(), query: ' ' }));
    $('p.message').i18n();
    return this;
  },

  onClose: function () {
    
    if (this.button===false) { 
	    this.games.removeSearch('me');	
	}
    
    this.undelegateEvents();
    this.games.off('sync', this.gameDeferred.resolve, this.gameDeferred);
       
  }
});