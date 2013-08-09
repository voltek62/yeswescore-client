(function (Y) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var Router = Backbone.Router.extend({
    history: [ /* { pageName: ..., pageHash: ... } */ ],

    currentView: null,

    routes: {
      //first page
      ''                   : 'games',
      // games
      'games/'             : 'games',
      'games/list'         : 'games',        
      'games/add'          : 'gameAdd',
      'games/:id/form'     : 'gameForm',      
      'games/follow'       : 'gameFollowed',
      'games/:id/end'      : 'gameEnd',
      'games/:id/comments/': 'gameComment', 
      'games/:id'          : 'game',      
      'games/me/:id'       : 'gameMe',
      'games/player/:id'   : 'gamePlayer',      
      'games/club/:id'     : 'gameClub',
      // players
      'players/me/games'   : 'playersMeGames',
      'players/:id/games'  : 'playersGames',
      'players/list'       : 'players',
      'players/club/:id'   : 'playerListByClub',
      'players/form/me'    : 'playerFormFirst',
      'players/form/search': 'playerFormSearch',                 
      'players/form'       : 'playerForm',          
      'players/signin'     : 'playerSignin',
      'players/forget'     : 'playerForget',
      'players/follow'     : 'playerFollowed',                                              
      'players/:id'        : 'player',
      // clubs
      'clubs/add'          : 'clubAdd',
      'clubs/follow'       : 'clubFollowed',
      'clubs/:id'          : 'club',
      'clubs/:id/games'    : 'clubsGames',
      // autres
      'search/form'        : 'searchForm',
      'notification'       : 'notificationList',
      'account'            : 'account',
      'about'              : 'about'
    },

    initialize: function (options) {

    },

    /*
    * @param Y.Views.*  view 
    * @param object     params 
    * @return function returning a view object.
    */
    createViewFactory: function (view, params) {
      assert(typeof view !== "undefined");
      return function () {
        return new view(params);
      };
    },

    about: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.About));
    },

    account: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.Account));
    },

    club: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.Club, { id: id }));
    },

    clubAdd: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.ClubAdd));
    },

    clubFollowed: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.ClubFollowed));
    },

    index: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.Index, { sort: id }));
    },

    game: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.Game, { id: id }));
    },

    games: function (sort) {
      this.changePage(this.createViewFactory(Y.Views.Pages.Games, { search: '', id: '', sort: sort || '' }));
    },
    
    gameMe: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.Games, { search: 'me', id: id, sort: '' }));
    },

    gamePlayer: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.Games, { search: 'player', id: id, sort: '' }));
    },

    gameClub: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.Games, { search: 'club', id: id, sort: '' }));
    },    

    gameAdd: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.GameAdd));
    },

    gameEnd: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.GameEnd, { id: id }));
    },

    gameComment: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.GameComments, { id: id }));
    },

    gameFollowed: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.GameFollowed));
    },
    
    gameForm: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.GameForm, { id: id }));
    },    

    notificationList: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.NotificationList));
    }, 

    player: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.Player, { id: id, follow: '' }));
    },

    playerFormFirst: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.PlayerForm, { mode: 'first'}));
    },
    
    playerForm: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.PlayerForm, { mode: ''}));
    },

    playerFormSearch: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.PlayerForm, { mode: 'search'}));
    },

    playerFollowed: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.Players, { mode: 'follow'}));
    },

    players: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.Players, { mode: ''}));
    },

    playerListByClub: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.Players, { clubid: id }));
    },

    playerSignin: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.PlayerSignin));
    },

    playerForget: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.PlayerForget));
    },
    
    searchForm: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.SearchForm ));
    },    

    /*
    * you can change page passing a function:
    *    this.changePage(function () { return new Y.Views.Pages.Account() });
    *
    * @param function  viewFactory    function returning a view
    */
    changePage: function (viewFactory) {
      assert(typeof viewFactory === "function");

      var previousPageName = "none"
        , previousPageHash = "none"
        , nextPageName = "unknown"
        , nextPageHash = "unknown"
        , view = null
        , that = this;

      // previous page name, page hash
      if (this.currentView && this.currentView.pageName)
        previousPageName = this.currentView.pageName;
      if (this.currentView && this.currentView.pageHash)
        previousPageHash = this.currentView.pageHash;

      // event
      try {
        this.trigger('beforePageChanged', previousPageName, previousPageHash);
      } catch (e) {
        assert(false);
      };

      // closing current view (still in the DOM)
      try {
        if (this.currentView) {
          this.currentView.close();
          // this.currentView.remove(); // FIXME. gc: should we call remove ?
        }
      } catch (e) {
        assert(false);
      };

      //
      // Reflow bug under ie10 (WP8) maybe iOS & android.
      // when document.documentElement is scrolled down & 
      //  loading a new small view inside #content
      //  the new view is rendered above the screen
      //  because document.height hasn't been reflowed yet 
      // 
      // using document.documentElement.scrollTop = 0; is not enough
      //   we must force a reflow & setTimeout to let the GUI thread some time to render.
      //
      // /!\ Be warned, this bugfix is empirical.
      //
      var next = function () {
        // creating view

        /*#ifdef DEV*/
        if (true) {
          // in dev, directly call viewFactory, to be able to debug exceptions.
          view = viewFactory();
        } else {
        /*#endif*/
          try {
            // avoiding exception in view.
            view = viewFactory();
          } catch (e) {
            assert(false);
          };
        /*#ifdef DEV*/
        }
        /*#endif*/

        // next page name, page hash
        if (view && view.pageName)
          nextPageName = view.pageName;
        if (view && view.pageHash)
          nextPageHash = view.pageHash;

        // acting the change in Router.currentView & Y.GUI.content
        that.currentView = view;
        Y.GUI.content = view;

        // event
        try {
          that.trigger('pageChanged', nextPageName, nextPageHash);
        } catch (e) {
          assert(false);
        };

        // stats.
        Y.Stats.page(previousPageName, nextPageName);
      };

      // scrolltop, juste after reflow
      // with a good browser engine (aka ie10) rendering is perfect.
      // FIXME: dependancy router => DOM .. yeak :(
      var WP8=true;
      /*#ifndef WP8*/
      WP8=true;
      /*#endif*/
      if (WP8) {
        if (document.documentElement)
          document.documentElement.scrollTop = 0;
        else
          document.body.scrollTop = 0;
        document.getElementById("content").getBoundingClientRect(); // force reflow
        setTimeout(next, 10);
      } else {
        next();
      }
    }
  });
  Y.Router = new Router();
})(Y);