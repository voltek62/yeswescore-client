(function (Y) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var Router = Backbone.Router.extend({
    history: [ /* { pageName: ..., pageHash: ... } */ ],

    currentView: null,

    locked: false,

    routes: {
      //first page
      ''                   : 'games',
      'add'                : 'add',
      //teams
      'teams/'             : 'teams',          
      'teams/list'         : 'teams',        
      'teams/add'          : 'teamAdd', 
      'teams/:id'          : 'team', 
      'teams/:id/comments/': 'teamComment',                
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
      'help'               : 'help',
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

    add: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.Add));
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
    
    team: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.Team, { id: id }));
    },

    teams: function (sort) {
      this.changePage(this.createViewFactory(Y.Views.Pages.Teams, { search: '', id: '', sort: sort || '' }));
    },

    teamAdd: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.TeamAdd));
    },   
    
    teamComment: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Pages.TeamComments, { id: id }));
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

    help: function () {
      this.changePage(this.createViewFactory(Y.Views.Pages.Help));
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

    lock: function () {
      this.locked = true;
    },

    unlock: function () {
      this.locked = false;
    },
    
    navigate: function (fragment, options) {
      // before Backbone.navigate, we check if the current GUI View can be closed.
      var defer = new $.Deferred();

      if (this.currentView &&
          typeof this.currentView.canClose === "function") {
          this.currentView.canClose(function (err, val) {
            if (err || !val) {
              return defer.reject();
            }
            return defer.resolve();
          })
      } else {
        defer.resolve();
      }
      //
      defer.then(
        function success() {
          Backbone.history.navigate(fragment, options);
        },
        function error() {
          console.log('error');/* nothing yet */ 
        }
      );
    },

    /*
    * you can change page passing a function:
    *    this.changePage(function () { return new Y.Views.Pages.Account() });
    *
    * @param function  viewFactory    function returning a view
    */
    changePage: function (viewFactory) {
      assert(typeof viewFactory === "function");

      if (this.locked)
        return; // navigation is locked.  

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

      // multiple async steps.
      new $.Deferred().resolve()
      // step1: trigger event "beforePageChanged"
      .then(
        function beforePageChanged() {
          try {
            that.trigger('beforePageChanged', previousPageName, previousPageHash);
          } catch (e) {
            assert(false);
          };
        })
      // step2: close the currentView (if it exists!)
      .then(
        function closeCurrentView() {
          // closing current view (still in the DOM)
          try {
            if (that.currentView) {
              that.currentView.close();
              // that.currentView.remove(); // FIXME. gc: should we call remove ?
            }
          } catch (e) {
            assert(false);
          };
        })
      // step3
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
      .then(
        function scrollTopBeforeRendering() {
          var defer = new $.Deferred();

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
            setTimeout(function () { defer.resolve(); }, 10);
          } else {
            defer.resolve();
          }
          return defer;
        })
      // step4 creating the view.
      .then(
        function createNewView() {
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
        })
      // step5 the page has now changed, emiting events & some stats.
      //     or global error catch handler (doing nothing)
      .then(
        function pageChanged() {
          // event
          try {
            that.trigger('pageChanged', nextPageName, nextPageHash);
          } catch (e) {
            assert(false);
          };

          // stats.
          Y.Stats.page(previousPageName, nextPageName);
        },
        function error() {
          // some error
        });

      return /*void*/;
    }
  });
  Y.Router = new Router();
})(Y);