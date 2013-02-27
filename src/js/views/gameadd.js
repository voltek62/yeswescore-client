var GameAddView = Backbone.View.extend({
  el: "#index",

  events: {
    'submit form#frmAddGame': 'addGame',
    'change #myself': 'updateTeam1',
    'change #team1': 'changeTeam1',
    'keyup #team1': 'updateListTeam1',
    'keyup #team2': 'updateListTeam2',
    'click #team1_choice': 'displayTeam1',
    'click #team2_choice': 'displayTeam2'
  },

  pageName: "gameAdd",

  listview1: "#team1_suggestions",
  listview2: "#team2_suggestions",

  initialize: function () {
    this.playerListAutoCompleteViewTemplate = Y.Templates.get('playerListAutoCompleteViewTemplate');
    this.gameAddTemplate = Y.Templates.get('gameAddTemplate');

    this.Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
    //this.players = new PlayersCollection('me');
    //console.log('Owner',this.players.storage.findAll({local:true}));	   	
    //this.Owner = new PlayerModel(this.players.storage.findAll({ local: true }));


    this.render();
    $.mobile.hidePageLoadingMsg();
  },

  displayTeam1: function (li) {
    selectedId = $('#team1_choice:checked').val();
    selectedName = $('#team1_choice:checked').next('label').text();
    selectedRank = $('#team1_choice:checked').next('label').next('label').text();
    //$('label[for=pre-payment]').text();

    $('#team1').val($.trim(selectedName));
    $('#rank1').val($.trim(selectedRank));
    $('#team1_id').val(selectedId);
    $('team1_error').html('');

    //console.log('selected '+selectedId+' '+selectedName);

    $(this.listview1).html('');
    $(this.listview1).listview('refresh');
  },

  displayTeam2: function (li) {
    selectedId = $('#team2_choice:checked').val();
    selectedName = $('#team2_choice:checked').next('label').text();
    selectedRank = $('#team2_choice:checked').next('label').next('label').text();
    //$('label[for=pre-payment]').text();

    $('#team2').val($.trim(selectedName));
    $('#rank2').val($.trim(selectedRank));
    $('#team2_id').val(selectedId);
    $('team2_error').html('');

    //console.log('selected '+selectedId+' '+selectedName);

    $(this.listview2).html('');
    $(this.listview2).listview('refresh');
  },

  fetchCollection: function () {
    if (this.collectionFetched) return;

    //this.usersCollection.fetch();
    /*
    this.userCollection.fetch({ url: Y.Conf.get("api.url.players")+'97e2f09341b45294f3cd2699', success: function() {
    console.log('usersCollection 2',this.userCollection);
    }});        */
    //Games.fetch();

    this.collectionFetched = true;
  },

  changeTeam1: function () {
    if ($('#myself').attr('checked') !== undefined) {
      console.log($('#myself').attr('checked'));

      //Si Owner.name == : On update objet Player
      if (Owner.name === '') {
        player = new Player({
          id: Owner.id,
          token: Owner.token,
          name: Owner.name,
          nickname: Owner.nickname,
          password: Owner.password,
          rank: Owner.rank,
          club: Owner.club
        });

        console.log('Player gameadd', player)

        player.save();
      }
    }
  },

  updateTeam1: function () {
    $('#team1').val(this.Owner.name);
    $('#rank1').val(this.Owner.rank);
    $('#team1_id').val(this.Owner.id);
  },

  updateListTeam1: function (event) {
    if ($('#myself').attr('checked') === undefined) {
      var q = $("#team1").val();

      this.playersTeam1 = new PlayersCollection();
      this.playersTeam1.setMode('search', q);
      if (q.length > 2) {
        this.playersTeam1.fetch();
        this.playersTeam1.on('all', this.renderListTeam1, this);
      }
    }
  },

  renderListTeam1: function () {
    var q = $("#team1").val();
    $(this.listview1).html(this.playerListAutoCompleteViewTemplate({ players: this.playersTeam1.toJSON(), query: q, select: 1 }));
    $(this.listview1).listview('refresh');
  },


  updateListTeam2: function (event) {
    var q = $("#team2").val();
    this.playersTeam2 = new PlayersCollection();
    this.playersTeam2.setMode('search', q);
    if (q.length > 2) {
      this.playersTeam2.fetch();

      this.playersTeam2.on('all', this.renderListTeam2, this);
    }

  },

  renderListTeam2: function () {
    var q = $("#team2").val();
    $(this.listview2).html(this.playerListAutoCompleteViewTemplate({ players: this.playersTeam2.toJSON(), query: q, select: 2 }));
    $(this.listview2).listview('refresh');
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
      //alert('Il manque le joueur 1 '+$('#myself').attr('checked'));
      $('span.team1_error').html('Vous devez indiquer un joueur !').show();
      return false;
    }

    if (rank1 === '') {
      //alert('Il manque le joueur 1 '+$('#myself').attr('checked'));
      $('span.team1_error').html('Vous devez indiquer le classement !').show();
      return false;
    }

    if (team2 === '' && team2_id === '') {
      $('span.team2_error').html('Vous devez indiquer un joueur !').show();
      return false;
    }

    if (rank2 === '') {
      //alert('Il manque le joueur 1 '+$('#myself').attr('checked'));
      $('span.team2_error').html('Vous devez indiquer le classement !').show();
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
	
    console.log('gameadd on envoie objet ', game);

    //On sauve dans Collections
    var gameNew = new GameModel(game);
    var gameCache = gameNew.save();

	//On stocke dans le localStorage
    //Y.Conf.set("Y.Cache.Game"+data.id, gameCache.id, { permanent: true })

    //console.log('gamecache.id ', gameCache.id);

    //if (gamecache.id !== 'undefined') {
      //Backbone.Router.navigate("/#games/"+gamecache.id, true);
      //window.location.href = '#games/' + gameCache.id;
    //}
    
    
    return false;
  },

  //render the content into div of view
  render: function () {
    this.$el.html(this.gameAddTemplate({ playerid: this.Owner.id, token: this.Owner.token }));
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose: function () {
    //Clean
    this.undelegateEvents();
    if (this.playersTeam1 !== undefined) this.playersTeam1.off("all", this.renderListTeam1, this);
    if (this.playersTeam2 !== undefined) this.playersTeam2.off("all", this.renderListTeam2, this);
  }
});