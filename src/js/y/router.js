(function (Y) {
  "use strict";

  // overloading backbone close.
  Backbone.View.prototype.close = function () {
    this.off();
    if (typeof this.onClose === "function")
      this.onClose();
  };

  var currentView = null;

  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      'index': 'index',
      'sort/:id' : 'index',
      'games/me/:id': 'gameMe',
      'games/add': 'gameAdd',
      'games/follow': 'gameFollow',
      'games/end/:id': 'gameEnd',
      'games/comment/:id': 'gameComment',
      'games/club/:id': 'gameClub',
      'games/:id': 'game',
      'players/list': 'playerList',
      'players/club/:id': 'playerListByClub',
      'players/form': 'playerForm',
      'players/signin': 'playerSignin',
      'players/forget': 'playerForget',
      'players/follow': 'playerFollow',
      //'players/follow/:id':                           'playerFollow',    
      //'players/nofollow/:id':                         'playerNoFollow',                                    
      'players/:id': 'player',
      'clubs/add': 'clubAdd',
      'clubs/:id': 'club',
      'account': 'account'
    },


    initialize: function (options) {

    },

    account: function () {
      var accountView = new Y.Views.Account();
      this.changePage(accountView);
    },

    club: function (id) {
      var clubView = new Y.Views.Club({ id: id });
      this.changePage(clubView);
    },

    clubAdd: function (id) {
      var clubAddView = new Y.Views.ClubAdd();
      this.changePage(clubAddView);
    },

    index: function (id) {
      var indexView = new Y.Views.Index({ id: id });     
      this.changePage(indexView);
    },

    
    game: function (id) {
      var gameView = new Y.Views.Game({ id: id });
      this.changePage(gameView);
    },

    gameAdd: function () {
      var gameAddView = new Y.Views.GameAdd();
      this.changePage(gameAddView);
    },

    gameEnd: function (id) {
      var gameEndView = new Y.Views.GameEnd({ id: id });
      this.changePage(gameEndView);
    },

    gameComment: function (id) {
      var gameCommentView = new Y.Views.GameComment({ id: id });
      this.changePage(gameCommentView);  
    },

    gameFollow: function () {
      var gameFollowView = new Y.Views.GameFollow();
      this.changePage(gameFollowView);
    },

    gameMe: function (id) {
      var gameListView = new Y.Views.GameList({ mode: 'me', id: id });
      this.changePage(gameListView);
    },

    gameClub: function (id) {
      var gameListView = new Y.Views.GameList({ mode: 'club', clubid: id });
      this.changePage(gameListView);
    },

    player: function (id) {
      var playerView = new Y.Views.Player({ id: id, follow: '' });
      this.changePage(playerView);
    },


    playerFollow: function (id) {
      var playerFollowView = new Y.Views.PlayerFollow();
      this.changePage(playerFollowView);
    },

    playerNoFollow: function (id) {
      var playerView = new Y.Views.Player({ id: id, follow: 'false' });
      this.changePage(playerView);
    },

    playerForm: function () {
      var playerFormView = new Y.Views.PlayerForm();
      this.changePage(playerFormView);
    },

    playerList: function () {
      var playerListView = new Y.Views.PlayerList();
      this.changePage(playerListView);
    },

    playerListByClub: function (id) {
      var playerListView = new Y.Views.PlayerList({ id: id });
      this.changePage(playerListView);
    },

    playerSignin: function () {
      var playerSigninView = new Y.Views.PlayerSignin();
      this.changePage(playerSigninView);
    },

    playerForget: function () {
      var playerForgetView = new Y.Views.PlayerForget();
      this.changePage(playerForgetView);
    },

    setNextTransition: function (el) {
    },

    changePage: function (view) {

      try {
        var previousPageName = "none";
        var nextPageName = "unknown";

        var previousPageHash = "none";
        var nextPageHash = "unknown";

        if (currentView && currentView.pageName) {
          previousPageName = currentView.pageName;        
        }
        
        if (currentView && currentView.pageHash) {
          previousPageHash = currentView.pageHash;  
        }
        
        if (currentView) {
          currentView.close();
        }
        
        currentView = view;
        
        if (view.pageName) {
          nextPageName = view.pageName;        
        }
        
        if (view.pageHash) {
          nextPageHash = view.pageHash;
        }  
        
        Y.Stats.page(previousPageName, nextPageName);
      }
      catch (e) {
        //console.log('DEV ChangePage Error', e);
      }


    },

    historyCount: 0
  });

  Y.Router = new Router();
})(Y);