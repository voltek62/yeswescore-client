var IndexView = Backbone.View.extend({
  el: "#index",

  events: {
    "keyup input#search-basic": "search"
  },

  listview: "#listGamesView",

  initialize: function () {
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

    this.render();

    //console.log('this.games in cache size ',this.games.length);

    this.games.on('all', this.renderList, this);
    
    //Controle si localStorage contient Owner
    var Owner = window.localStorage.getItem("Owner");

    //window.localStorage.clear();
    
    if (Owner === null) {
      //alert('Pas de owner');
      //Creation user à la volée
      console.log('Pas de Owner, on efface la cache . On crée le Ownner');
        
      //debug si pas de Owner, on init le localStorage
      window.localStorage.removeItem("Owner");

      player = new PlayerModel();
      player.save();
      //players = new PlayersCollection('me');
      //players.create();
    }
    else {
      Y.Geolocation.on("change", function (longitude, latitude) { 
        
        var Owner = JSON.tryParse(window.localStorage.getItem("Owner"));
        //console.log("On mémorise la Geoloc OK pour playerid :"+Owner.id);
        
        //On sauve avec les coord actuels
        player = new PlayerModel({
           latitude : latitude
         , longitude : longitude
         , playerid : Owner.id
         , token : Owner.token
        });
        player.save();
        
      });
    }
    
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
    return this;
  },

  renderList: function (query) {
  
 	//console.log('renderList games:',this.games.toJSON());
  
    $(this.listview).html(this.gameListViewTemplate({ games: this.games.toJSON(), query: ' ' }));
    $(this.listview).listview('refresh');
    $.mobile.hidePageLoadingMsg();
    return this;
  },

  onClose: function () {
    this.undelegateEvents();
    this.games.off("all", this.renderList, this);
  }
});