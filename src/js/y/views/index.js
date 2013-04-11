Y.Views.Index = Y.View.extend({
  el: "#content",

  events: {
    // mode "input"
    'focus input[type="search"]': 'inputModeOn',
    'blur input[type="search"]': 'inputModeOff',

    //"keyup input#search-basic": "search",
    "blur input#search-basic": "search",
    "click li": "goToGame",    
    "click #sendFilter": "sendFilter"
  },

  listview: "#listGamesView",

  pageName: "index",
  pageHash : "index",  
  
  initialize: function () {
    Y.GUI.header.title("LISTE DES MATCHES");

    var that = this;
    //
    this.indexViewTemplate = Y.Templates.get('index');
    this.gameListViewTemplate = Y.Templates.get('gameListView');

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
    var gameDeferred = $.Deferred();
    this.games = new GamesCollection();
    if (this.id !== '')
      this.games.setSort(this.id);
    this.games.on('sync', gameDeferred.resolve, gameDeferred);
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
      gameDeferred,
      playerDeferred
    ).done(function () {
      that.render();
      that.renderList();
    });
  },


  goToGame: function (elmt) { 
    console.log('goToGame',elmt.currentTarget.id); 
    
    var route = elmt.currentTarget.id;
    Y.Router.navigate(route, {trigger: true}); 
  
  },

  sendFilter: function () {
    //console.log("sendFilter");
    /*$.ui.actionsheet('<a href="#sort/date" class="button">Afficher par Date</a>'
    + ' <a href="#sort/location" class="button">Afficher par Lieu</a>'
    + ' <a href="#sort/ongoing" class="button">Afficher Matchs encours</a>'
    + ' <a href="#sort/finished" class="button">Afficher Matchs finis</a>');
    */
  },

  search: function () {
  

    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    
    //console.log('search '+q);
        
    $(this.listview).empty();
    //gamesList = new GamesSearch();
    //gamesList.setQuery(q);
    //gamesList.fetch();
    this.games.setMode('player', q);
    this.games.fetch();
    $(this.listview).html(this.gameListViewTemplate({ games: this.games.toJSON(), query: q }));
    //$(this.listview).listview('refresh');
    //}
    return this;
  },

  // should not take any parameters
  render: function () {
    this.$el.html(this.indexViewTemplate(), {});
    return this;
  },

  // should not take any parameters
  renderList: function () {
    $(this.listview).html(this.gameListViewTemplate({ games: this.games.toJSON(), query: ' ' }));
    return this;
  },

  onClose: function () {
    this.undelegateEvents();
    //this.games.off("all", this.renderList, this);
  }
});