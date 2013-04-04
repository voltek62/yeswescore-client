Y.Views.Index = Backbone.View.extend({
  el: "#content",

  events: {
    "keyup input#search-basic": "search",
    "click #sendFilter": "sendFilter"
  },

  listview: "#listGamesView",

  pageName: "index",
  pageHash : "index",  
  
  initialize: function () {
    Y.GUI.header.title("LISTE DES MATCHES");

    //
    this.indexViewTemplate = Y.Templates.get('index');
    this.gameListViewTemplate = Y.Templates.get('gameListView');

    //we capture config from bootstrap
    //FIXME: put a timer
    //this.config = new Config();
    //this.config.fetch();

    this.games = new GamesCollection();
    if (this.id !== '') {
      this.games.setSort(this.id);
    }

    this.games.fetch();

    //console.log('this.id ',this.id);


    // $.ui.showMask('please wait, loading player');

    var that = this;

    Y.User.getPlayerAsync(function (err, player) {
      if (err) {
        // no player => creating player.
        console.log('error reading player ', err);
        // creating the player.
        Y.User.createPlayerAsync(function (err, player) {
          console.log('player created', player);

          // $.ui.hideMask();

          // rendering
      	  that.render();
      	  that.games.on('all', that.renderList, that);


        });
        return;
      }
      // continue
      // $.ui.hideMask();


      that.render();
      that.games.on('all', that.renderList, that);
 
 	  /* GEOLOCALISATION */
 	  /*
      Y.Geolocation.on("change", function (pos) { 
          
          this.Owner = Y.User.getPlayer().toJSON();
	      // On sauve le player avec les coord actuels
	      player = new PlayerModel({
	      latitude : pos[1]
	      , longitude : pos[0]
	      , playerid : this.Owner.id
	      , token : this.Owner.token
	      });
	      player.save();
	        
	      // On charge les parties par Géolocalisation
	      this.games = new GamesCollection();
	      this.games.setMode('geolocation','');
	      this.games.setPos(pos);
	      this.games.fetch();
	      this.games.on('all', this.renderList, this);
       	  
        
      });
      */
      
      

    });


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

  render: function () {
    this.$el.html(this.indexViewTemplate(), {});

    return this;
  },

  renderList: function (query) {


    $(this.listview).html(this.gameListViewTemplate({ games: this.games.toJSON(), query: ' ' }));

    return this;
  },

  onClose: function () {
    this.undelegateEvents();
    this.games.off("all", this.renderList, this);
    
	
  }
});