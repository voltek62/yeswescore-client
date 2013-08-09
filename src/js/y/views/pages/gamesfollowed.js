Y.Views.Pages.GameFollowed = Y.View.extend({
  el:"#content",

  listview:"#listGamesView",
    
  events: {
    "click li": "goToGame",
    "keyup input#search-basic": "searchOnKey",  
    "blur input#search-basic": "searchOnBlur",
    "click .refresh" : "refresh",
    "click button-option-down": "search"
  },

  pageName: "gameFollow",
  pageHash: "games/follow",
  
  games: null,

  myinitialize:function() {
    Y.GUI.header.title(i18n.t('gamefollow.title'));        
  
    this.templates = {
      list:  Y.Templates.get('list-game'),
      page: Y.Templates.get('page-games'),
      error: Y.Templates.get('module-error'),
      ongoing: Y.Templates.get('module-ongoing')      
    };
    this.render();
  this.refresh();
  },
  
  goToGame: function (elmt) {
    if (elmt.currentTarget.id) {
      var route = elmt.currentTarget.id;
      Y.Router.navigate(route, {trigger: true}); 
    }
  },
  
  refresh: function () {
    var games_follow = Y.Conf.get("owner.games.followed");
    var games = games_follow;    
    var players_follow = Y.User.getPlayer().get('following');    
  
    if (games!==undefined) {   
      this.gameLast = games[games.length-1];     
      this.collection = new GamesCollection();      
      var that = this;      
      var i = games.length;

      if (games.length<1) {
        $(this.listview).html(this.templates.list({games:[], games_follow : games_follow, players_follow : players_follow,query:' '}));
        $('p.message').i18n();              
      }
      
      this.syncGame = function (game) {      
        that.collection.add(game);        
        i--;                
        //si dernier element du tableau
        if (that.gameLast === game.get('id')) {
          $(that.listview).html(that.templates.list({games:that.collection.toJSON(), games_follow : games_follow, players_follow : players_follow,query:' '})); 
        }
      };
      
      this.games = [];

      games.forEach(function (gameid,index) {      
      var game = new GameModel({id : gameid});          
          game.once("sync", this.syncGame, this);
          game.fetch().fail(function (xhrResult, error) {
            if (games.indexOf(gameid) !== -1) {
              games.splice(games.indexOf(gameid), 1);
              Y.Conf.set("owner.games.followed", games, { permanent: true });
              if (games.length<1) {
                $(that.listview).html(that.templates.list({games:[], games_follow : games_follow, players_follow : players_follow,query:' '}));
                $('p.message').i18n();
              } else {
                this.gameLast = games[games.length-1];
              }
            }
          });
          this.games[index] = game;
      },this);
    } else {
      $(this.listview).html(this.templates.list({games:[], games_follow : games_follow, players_follow : players_follow,query:' '}));
      $('p.message').i18n();
    }
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
    
  search:function() {
    var q = $("#search-basic").val();
    $(this.listview).html(this.templates.ongoing()); 
    $('p').i18n();     
    this.games = new GamesCollection();      
    this.games.setSearch('player',q);
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

  render: function(){
    this.$el.html(this.templates.page({ button:false })).i18n(); 
    return this;
  },
  
  onClose: function() {
    if (this.games!==undefined && this.games!==null) {
      this.games.forEach(function (game) {
         game.off("sync", this.syncGame, this);
      }, this);
    }
  }
});
