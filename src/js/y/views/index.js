var IndexView = Backbone.View.extend({
  el: "#content",

  events: {
    "keyup input#search-basic": "search"
  },

  listview: "#listGamesView",

  pageName: "index",

  initialize: function () {
  
  
  var options={ 
  verticalScroll:true, //vertical scrolling 
  horizontalScroll:false, //horizontal scrolling 
  scrollBars:true, //display scrollbars 
  //vScrollCSS : "scrollBarV", //CSS class for veritcal scrollbar 
  //hScrollCSS : "scrollBarH", //CSS class for horizontal scrollbar 
  refresh:true, //Adds 'Pull to refresh' at the top 
  //refreshFunction:updateMessage //callback function to execute on pull to refresh 
  }; 
  
  var scroller = $("#content").scroller(options);
  

  
  this.indexViewTemplate = Y.Templates.get('indexViewTemplate');
  this.gameListViewTemplate = Y.Templates.get('gameListViewTemplate');

    //we capture config from bootstrap
    //FIXME: put a timer
    //this.config = new Config();
    //this.config.fetch();

    this.games = new GamesCollection();
    this.games.fetch();

    //console.log('on pull');
    //this.games.storage.sync.pull();   

    this.$el.html("please wait, loading player");
	
	var that = this; 
	
    Y.User.getPlayerAsync(function (err, player) {
      if (err) {
        // no player => creating player.
        console.log('error reading player ', err);
        // creating the player.
        Y.User.createPlayerAsync(function (err, player) {
          console.log('player created', player);
          // rendering
          that.render();
          that.games.on('all', that.renderList, that);
              
        });
        return;
      }
      // continue
      that.render();
      that.games.on('all', that.renderList, that);
      
    });

    //this.render();

    //console.log('this.games in cache size ',this.games.length);



    //Controle si localStorage contient Owner
    //var Owner = window.localStorage.getItem("Y.Cache.Player");

    /*
    if (Owner === null) {
    //alert('Pas de owner');
    //Creation user à la volée
    console.log('Pas de Owner, on efface la cache . On crée le Owner');
        
    //debug si pas de Owner, on init le localStorage
    window.localStorage.removeItem("Y.Cache.Player");

    player = new PlayerModel();
    player.save();
    //players = new PlayersCollection('me');
    //players.create();
    }
    else {
    Y.Geolocation.on("change", function (pos) { 
        
    var Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
    //console.log("On mémorise la Geoloc OK pour playerid :"+Owner.id);
        
    //On sauve avec les coord actuels
    player = new PlayerModel({
    latitude : pos[1]
    , longitude : pos[0]
    , playerid : Owner.id
    , token : Owner.token
    });
    player.save();
        
    this.games = new GamesCollection();
    this.games.setMode('geolocation','');
    this.games.setPos(pos);
    this.games.fetch();
    this.games.on('all', this.renderList, this);
        
        
    });
    }
    */

  },

  search: function () {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();
    //gamesList = new GamesSearch();
    //gamesList.setQuery(q);
    //gamesList.fetch();
    this.games.setMode('player', q);
    this.games.fetch();
    $(this.listview).html(this.gameListViewTemplate({ games: this.games.toJSON(), query: q }));
    $(this.listview).listview('refresh');
    //}
    return this;
  },

  render: function () {
    this.$el.html(this.indexViewTemplate(), {});
    //Trigger jquerymobile rendering
    this.$el.trigger('pagecreate');

    //new Y.FastButton(document.querySelector("#mnufollow"), function () { Y.Router.navigate('#', true);});
    //new Y.FastButton(document.querySelector("#mnudiffuse"), function () { Y.Router.navigate('#games/add', true);});
    //new Y.FastButton(document.querySelector("#mnuaccount"), function () { Y.Router.navigate('#account', true);});

    return this;
  },

  renderList: function (query) {

    //console.log('renderList games:',this.games.toJSON());

    $(this.listview).html(this.gameListViewTemplate({ games: this.games.toJSON(), query: ' ' }));
    //$(this.listview).listview('refresh');
    //$.mobile.hidePageLoadingMsg();
    return this;
  },

  onClose: function () {
    this.undelegateEvents();
    this.games.off("all", this.renderList, this);

  }
});