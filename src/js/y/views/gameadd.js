Y.Views.GameAdd = Y.View.extend({
  el: "#content",

  events: {
    'click #addGame': 'addGame',
    'click .form-button.other-team': 'otherTeam',
    'click .form-button.more-options': 'moreOption',
    'blur #team1': 'changeTeam1'
  },

  pageName: "gameAdd",
  pageHash : "games/add",  

  listview1: "#team1_suggestions",
  listview2: "#team2_suggestions",
  
  useSearch:0,

  myinitialize: function () {  
  
    this.useSearch = 0;	
  
  	//header
    Y.GUI.header.title("CREER UNE PARTIE");
  	this.templates = {
	    gameadd:  Y.Templates.get('gameAdd'),
	    playerlist: Y.Templates.get('playerListAutoComplete')
	  };
    this.owner = Y.User.getPlayer().toJSON();
	  this.render();
  },

  otherTeam: function () {
    $(".form-button.other-team").addClass("selected");
    $(".ui-grid-b.first-team").removeClass("me");
    $("#team1").prop("disabled", false);
    // on force l'input mode
    $("#team1").focus();
    this.$("#team1").trigger("click");
  },

  moreOption: function () {
    $(".form-button.more-options").toggleClass("selected");
    $("#gameAddForm").toggleClass("simple");
  },
    
  changeTeam1: function () {
    if ($("#team1").val() == "") {
      $(".form-button.other-team").removeClass("selected");
      $(".ui-grid-b.first-team").addClass("me");
      $("#team1").prop("disabled", true);
    }
  },

  addGame: function (event) {
    var team1 = $('#team1').val()
      , rank1 = $('#rank1').val()
      , team1_id = $('#team1_id').val()
      , team2 = $('#team2').val()
      , rank2 = $('#rank2').val()
      , team2_id = $('#team2_id').val()
      , city = $('#city').val()
      , playerid = $('#playerid').val()
      , token = $('#token').val()
      , court = $('#court').val()
      , surface = $('#surface').val()
      , tour = $('#tour').val()
      , subtype = $('#subtype').val()
      , game = null;

    if (team1 === '' && team1_id === '') {
      $('span.team1_error').html('Vous devez indiquer un joueur !').show();
      return false;
    }

    if (team2 === '' && team2_id === '') {
      $('span.team2_error').html('Vous devez indiquer un joueur !').show();
      return false;
    }

    var game = {
		team1 : $('#team1').val()
      , rank1 : $('#rank1').val()
      , team1_id : $('#team1_id').val()
      , team2 : $('#team2').val()
      , rank2 : $('#rank2').val()
      , team2_id : $('#team2_id').val()
      , city : $('#city').val()
      , playerid : $('#playerid').val()
      , token : $('#token').val()
      , court : $('#court').val()
      , surface : $('#surface').val()
      , tour : $('#tour').val()
      , subtype : $('#subtype').val()
    };

	  /*
      if (team1_id.length > 2)
        game.teams[0].players[0].id = team1_id;
      else
        game.teams[0].players[0].name = team1;

      if (team2_id.length > 2)
        game.teams[1].players[0].id = team2_id;
      else
        game.teams[1].players[0].name = team2;
	  */
	
    //On sauve dans Collections
    var game = new GameModel(game);    
    game.save({}, {success: function(model, response){
	    console.log('success '+'games/'+model.id);
        Y.Router.navigate('games/'+model.id, {trigger: true});	
	      //Mis par defaut dans mes matchs
        //Y.Conf.set("Y.Cache.Game"+data.id, gameCache.id, { permanent: true })              
      }
  	});   

    return false;
  },

  autocompletePlayers: function (input, callback) {
    console.log('input temporized: ' + input);
    Backbone.ajax({
      url: Y.Conf.get("api.url.autocomplete.players"),
      type: 'GET',
      dataType : 'json',
      data: { q: input }
    }).done(function (players) {
      if (players && _.isArray(players)) {
        callback(null, players.splice(0, 3).map(function (p) { p.text = p.name; return p; }));
      } else {
        callback(null, []);
      }
    }).fail(function (xhr, error) { 
      callback(error);
    });

    /*setTimeout(function () { 
      callback(null, [{text: "titi"}, {text: String(Math.random())}]);
    }, 3000);*/
  },

  autocompleteTeam1: function (data) {
    console.log("autocomplete data: " + JSON.stringify(data));
    if (data && data.name)
      this.$("#team1").val(data.name);
  },

  autocompleteTeam2: function (data) {
    console.log("autocomplete data: " + JSON.stringify(data));
    if (data && data.name)
      this.$("#team2").val(data.name);
  },

  //render the content into div of view
  render: function () {
    this.$el.html(this.templates.gameadd({ playerid: this.owner.id, token: this.owner.token }));

    return this;
  },

  onClose: function () {
    //Clean
    this.autocompleteStop();
    this.undelegateEvents();
    if (this.playersTeam1 !== undefined) this.playersTeam1.off("all", this.renderListTeam1, this);
    if (this.playersTeam2 !== undefined) this.playersTeam2.off("all", this.renderListTeam2, this);
  }
});