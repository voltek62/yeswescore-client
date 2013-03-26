(function (Y) {
  "use strict";

  // overloading backbone close.
  Backbone.View.prototype.close = function () {
    this.off();
    if (typeof this.onClose === "function")
      this.onClose();
  };

  var currentView = null;

  /* JQmobi
  $.mvc.addRoute("/foo",function(){
  var args=arguments;
  console.log("Foo",arguments);
  });
	
  */
  var scroller = null;

  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
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
    
      var that = this; 
      jq.ui.customClickHandler = function (a) {
        that.navigate(a.hash.substr(1), { trigger: true });
        
        return true;
      };
      
  
    },

    account: function () {
      var accountView = new AccountView();
      this.changePage(accountView);
      scroller.lock();
    },

    club: function (id) {
      var clubView = new ClubView({ id: id });
      this.changePage(clubView);
      scroller.lock();
    },

    clubAdd: function (id) {
      var clubAddView = new ClubAddView();
      this.changePage(clubAddView);
      scroller.lock();
    },

    index: function (id) {
      var indexView = new IndexView({ id: id });
      this.changePage(indexView);
      scroller.unlock();
    },

    
    game: function (id) {
      var gameView = new GameView({ id: id });
      this.changePage(gameView);
      scroller.lock();
    },

    gameAdd: function () {
      var gameAddView = new GameAddView();
      this.changePage(gameAddView);
      scroller.lock();
    },

    gameEnd: function (id) {
      var gameEndView = new GameEndView({ id: id });
      this.changePage(gameEndView);
      scroller.lock();
    },

    gameComment: function (id) {
      var gameCommentView = new GameCommentView({ id: id });
      this.changePage(gameCommentView);
      scroller.lock();
    },

    gameFollow: function () {
      var gameFollowView = new GameFollowView();
      this.changePage(gameFollowView);
      scroller.lock();
    },

    gameMe: function (id) {
      var gameListView = new GameListView({ mode: 'me', id: id });
      this.changePage(gameListView);
      scroller.lock();
    },

    gameClub: function (id) {
      var gameListView = new GameListView({ mode: 'club', clubid: id });
      this.changePage(gameListView);
      scroller.lock();
    },

    player: function (id) {
      //console.log('router ',id);
      var playerView = new PlayerView({ id: id, follow: '' });
      this.changePage(playerView);
      scroller.lock();
    },


    playerFollow: function (id) {
      var playerFollowView = new PlayerFollowView();
      this.changePage(playerFollowView);
      scroller.lock();
    },

    playerNoFollow: function (id) {
      var playerView = new PlayerView({ id: id, follow: 'false' });
      this.changePage(playerView);
      scroller.lock();
    },

    playerForm: function () {
      var playerFormView = new PlayerFormView();
      this.changePage(playerFormView);
      scroller.lock();
    },

    playerList: function () {
      var playerListView = new PlayerListView();
      this.changePage(playerListView);
      scroller.unlock();
    },

    playerListByClub: function (id) {
      var playerListView = new PlayerListView({ id: id });
      this.changePage(playerListView);
      scroller.unlock();
    },

    playerSignin: function () {
      var playerSigninView = new PlayerSigninView();
      this.changePage(playerSigninView);
      scroller.lock();
    },

    playerForget: function () {
      var playerForgetView = new PlayerForgetView();
      this.changePage(playerForgetView);
      scroller.lock();
    },

    setNextTransition: function (el) {
    },

    changePage: function (view) {

      try {
        var previousPageName = "none";
        var nextPageName = "unknown";

        if (currentView && currentView.pageName)
          previousPageName = currentView.pageName;
        if (currentView)
          currentView.close();
        currentView = view;
        if (view.pageName)
          nextPageName = view.pageName;

        Y.Stats.page(previousPageName, nextPageName);
        console.log('DEV ChangePage', new Date().getTime());
        
		//Par defaut , pas de scroll	
		//$.feat.nativeTouchScroll = true;
		$.ui.ready(function(){
	       scroller=$("#content").scroller();//Fetch the scroller from cache
	       //scroller.addInfinite();
	       //scroller.enable();
	       //$("#content").css("overflow","auto");
		   scroller.scrollToTop();	
		 });      
	
	    


		
        // FIXME: render of view should be here ?
      }
      catch (e) {
        console.log('DEV ChangePage Error', e);
      }


    },

    historyCount: 0
  });

  Y.Router = new Router();
})(Y);