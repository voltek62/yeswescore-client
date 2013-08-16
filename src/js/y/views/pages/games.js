Y.Views.Pages.Games = Y.View.extend({
  el: "#content",

  events: {
    // mode "input"
    "keyup input#search-basic": "searchOnKey",
    //"blur input#search-basic": "searchOnBlur",
    "mousedown .button-search": "searchButton",
    "click li": "goToGame",
    'click .button-option-right': 'showFilters',
   
    'vclick a[data-filter="searchmyclub"]':'deleteFilter', 
    'vclick a[data-filter="searchgeo"]':'deleteFilter',    
        
    'click div[data-sort="status-all"]': 'sortByStatusAll',
    'click div[data-sort="status-ongoing"]': 'sortByStatusOngoing',    
    'click div[data-sort="status-finished"]': 'sortByStatusFinished',      
    'click div[data-sort="status-created"]': 'sortByStatusCreated'
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

    //
    this.onResume = function () { that.search(); };
    
    this.templates = {
      list:  Y.Templates.get('list-game'),
      page: Y.Templates.get('page-games'),
      error: Y.Templates.get('module-error'),
      ongoing: Y.Templates.get('module-ongoing')      
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

    // 
    var searchType = (param) ? param.search : null;
    switch (searchType) {
      case 'me':
        // we can access Y.User.getPlayer, because option search == "me" should'nt triggered on first launch.
        this.games.addSearch('player');
        this.games.setPlayer(Y.User.getPlayer().id);
        break;
      case 'player':
        this.games.addSearch('player');
        this.games.setPlayer(param.id);
        break;
      case 'club':
        // FIXME
        this.games.addSearch('club');
        this.games.setClub(param.id);        
        break;
      default:
        // on utilise les options de recherche de l'utilisateur
        this.games.setSearchOptions(Y.User.getSearchOptions());
        break;
    }
            
    this.games.on('sync', this.gameDeferred.resolve, this.gameDeferred);
    this.games.fetch();

    // second: read/create player
    var playerDeferred = $.Deferred();
    Y.User.getOrCreatePlayerAsync(function (err, player) {
      document.addEventListener("resume", that.onResume, true);
      playerDeferred.resolve(); 
    });

    this.startControlTimeout();

    // le render ne dépend que de button, il peut être appelé immédiatement
    this.render();
    // le render des options ne dépend que de Y.User.getSearchOptions() qui est
    //  en local Storage => appelable immédiatement.
    this.renderSearchOptions();

    // FIXME: handling error with deferreds
    $.when(
      this.gameDeferred,
      playerDeferred
    ).done(function () {
      that.stopControlTimeout();
      that.renderList();     
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
      this.controlTimeout = window.setTimeout(_.bind(function () {
        this.$el.html("<span style=\"top:50px;position:absolute;top:50px;width:100%;text-align:center;\">"+i18n.t('message.noconnection')+"</span>");
        this.controlTimeout = null;
      }, this), 10000);
    }
  },

  stopControlTimeout: function () {
    if (this.controlTimeout) {
      window.clearTimeout(this.controlTimeout);
      this.controlTimeout = null;
    }
  },

  // filtres des options de recherche
  showFilters: function () {
    Y.Router.navigate("search/form", {trigger: true}); 
  },
  
  deleteFilter : function (event) {
    var cmd = event.currentTarget.id;
    
    if (cmd==='searchgeoselect'||cmd==='searchmyclubselect') {
      Y.User.setSearchOptions({filters:[]});
      this.games.removeSearch('geo');
      this.games.removeSearch('club');
    }
    this.renderSearchOptions();
    this.search();
  },  
  
  sortByStatusAll: function () { this.setSortOption("all") },
  sortByStatusOngoing: function () { this.setSortOption("ongoing") },
  sortByStatusFinished: function () { this.setSortOption("finished") },
  sortByStatusCreated: function () { this.setSortOption("created") },
  setSortOption: function (sortOption) {
    Y.User.setSearchOptions({sort: sortOption});
    this.renderSearchOptions();
    this.search();
  },

  searchButton: function () {
    this.inputModeOff();
    this.search();
  },

  searchOnKey: function (event) {
    if(event.keyCode == 13){
      // the user has pressed on ENTER
      this.inputModeOff();  
      this.search();     
    }
    return this;
  },

  search: function () {
    var q = $("#search-basic").val();
    $(this.listview).html(this.templates.ongoing());
    $('p').i18n(); 

    this.games.setSearchOptions(Y.User.getSearchOptions());
   
    if (q) {
      this.games.addSearch('player');   
      this.games.setQuery(q);
    } else {
      this.games.removeSearch('player');
    }

    this.games.fetch().done($.proxy(function () {    
      if (this.games.toJSON().length === 0) {
        $(this.listview).html(this.templates.error());
      } else {
        var games_follow = Y.Conf.get("owner.games.followed");
        var players_follow = Y.User.getPlayer().get('following');

        $(this.listview).html(this.templates.list({ games: this.games.toJSON(), games_follow : games_follow, players_follow : players_follow, query: q }));
      }
      $(this.listview).i18n();
    }, this));
    
    return this;
  },

  // should not take any parameters
  render: function () {
    this.$el.html(this.templates.page({ button:this.button })).i18n();
    $(this.listview).html(this.templates.ongoing());
    return this;
  },

  renderSearchOptions: function () {
    var userSearchOptions = Y.User.getSearchOptions();
    // filters
    var filters = userSearchOptions.filters;
    if (filters.length === 0) {
      $('.advancedsearch').hide();
    } else {
      if (filters.indexOf('searchgeo')!==-1) {
        $('#searchgeo').html('<a data-filter="searchgeo" id="searchgeoselect">'+i18n.t('search.filtergps')+'</a>');
      } else {
        $('#searchgeo').html('');
      }
      if (filters.indexOf('searchmyclub')!==-1) {
        $('#searchmyclub').html('<a data-filter="searchmyclub" id="searchmyclubselect">'+i18n.t('search.filtermyclub')+'</a>');  
      } else {
        $('#searchmyclub').html('');  
      }
    }
    // sort
    var sort = userSearchOptions.sort || 'all';
    $(".search div[data-sort*='status'] span").removeClass('select');
    $(".search div[data-sort='status-" + sort + "'] span").addClass('select');
  },

  // should not take any parameters
  renderList: function () {
    var games_follow = Y.Conf.get("owner.games.followed");
    var players_follow = Y.User.getPlayer().get('following');
    
    $(this.listview).html(this.templates.list({ games: this.games.toJSON(), games_follow : games_follow, players_follow : players_follow, query: ' ' }));
    $('p.message').i18n();
    return this;
  },

  goToGame: function (elmt) {
    if (elmt.currentTarget.id) {
      var route = elmt.currentTarget.id;
      Y.Router.navigate(route, {trigger: true}); 
    }
  },

  onClose: function () {
    if (this.button===false) { 
      this.games.removeSearch('me');
    }
  
    this.stopControlTimeout();
    
    document.removeEventListener("resume", this.onResume, true);
    
    this.undelegateEvents();
    this.games.off('sync', this.gameDeferred.resolve, this.gameDeferred);
  }   
  
});