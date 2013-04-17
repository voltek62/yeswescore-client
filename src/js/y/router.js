(function (Y) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  // overloading backbone close.
  Backbone.View.prototype.close = function () {
    this.off();
    if (typeof this.onClose === "function")
      this.onClose();
  };

  var Router = Backbone.Router.extend({
    history: [ /* { pageName: ..., pageHash: ... } */ ],

    currentView: null,

    routes: {
      '': 'games',
      'index': 'games',
      'sort/:id': 'games',
      'games/me/:id': 'gameMe',
      'games/add': 'gameAdd',
      'games/follow': 'gameFollow',
      'games/end/:id': 'gameEnd',
      'games/comment/:id': 'gameComment',
      'games/club/:id': 'gameClub',
      'games/list': 'games',   
      'games/:id': 'game', 
      'games/': 'games',        
      'players/list': 'playerList',
      'players/club/:id': 'playerListByClub',
      'players/form': 'playerForm',
      'players/signin': 'playerSignin',
      'players/forget': 'playerForget',
      'players/follow': 'playerFollow',                                    
      'players/:id': 'player',
      'clubs/add': 'clubAdd',
      'clubs/follow': 'clubAdd',      
      'clubs/:id': 'club',
      'account': 'account'
    },

    initialize: function (options) {

    },

    /*
    * @param Y.Views.*  view 
    * @param object     params 
    * @return function returning a view object.
    */
    createViewFactory: function (view, params) {
      return function () {
        return new view(params);
      };
    },

    account: function () {
      this.changePage(this.createViewFactory(Y.Views.Account));
    },

    club: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Club, { id: id }));
    },

    clubAdd: function (id) {
      this.changePage(this.createViewFactory(Y.Views.ClubAdd));
    },

    index: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Index, { sort: id }));
    },

    game: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Game, { id: id }));
    },

    games: function (sort) {
      console.log('on demande la vue games');
      if (typeof sort === "undefined") sort='';
      this.changePage(this.createViewFactory(Y.Views.Games, { mode: '', id: '', sort: sort }));
    },
    
    gameMe: function (id) {
      console.log('on demande la vue my games');
      this.changePage(this.createViewFactory(Y.Views.Games, { mode: 'me', id: id, sort: '' }));
    },

    gameClub: function (id) {
     console.log('on demande la vue games club');
      this.changePage(this.createViewFactory(Y.Views.Games, { mode: 'club', id: id, sort: '' }));
    },    

    gameAdd: function () {
      this.changePage(this.createViewFactory(Y.Views.GameAdd));
    },

    gameEnd: function (id) {
      this.changePage(this.createViewFactory(Y.Views.GameEnd, { id: id }));
    },

    gameComment: function (id) {
      this.changePage(this.createViewFactory(Y.Views.GameComment, { id: id }));
    },

    gameFollow: function () {
      this.changePage(this.createViewFactory(Y.Views.GameFollow));
    },

    player: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Player, { id: id, follow: '' }));
    },

    playerFollow: function (id) {
      this.changePage(this.createViewFactory(Y.Views.PlayerFollow));
    },

    playerNoFollow: function (id) {
      this.changePage(this.createViewFactory(Y.Views.Player, { id: id, follow: 'false' }));
    },

    playerForm: function () {
      this.changePage(this.createViewFactory(Y.Views.PlayerForm));
    },

    playerList: function () {
      this.changePage(this.createViewFactory(Y.Views.PlayerList));
    },

    playerListByClub: function (id) {
      //console.log("playerListByClub "+id);
      this.changePage(this.createViewFactory(Y.Views.PlayerList, { id: id }));
    },

    playerSignin: function () {
      this.changePage(this.createViewFactory(Y.Views.PlayerSignin));
    },

    playerForget: function () {
      this.changePage(this.createViewFactory(Y.Views.PlayerForget));
    },

    /*
    * you can change page passing a function:
    *    this.changePage(function () { return new Y.Views.Account() });
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
        if (this.currentView)
          this.currentView.close();
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
        try {
          view = viewFactory();
        } catch (e) {
          assert(false);
        };

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