Y.Views.GameAdd = Y.View.extend({
  el: "#content",

  events: {
    'click #addGame': 'addGame',
    'blur #team1': 'updateListTeam1',
    'blur #team2': 'updateListTeam2',
    'click #team1_choice': 'displayTeam1',
    'click #team2_choice': 'displayTeam2',

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
	    
      
    this.Owner = Y.User.getPlayer().toJSON();
	this.render();

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
    //&$(this.listview1).listview('refresh');
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
    //$(this.listview2).listview('refresh');
  },

  otherTeam: function () {
    $(".form-button.other-team").addClass("selected");
    $(".ui-grid-b.first-team").removeClass("me");
    $("#team1").prop("disabled", false);
    $("#team1").focus();
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

  updateTeam1: function () {
    $('#team1').val(this.Owner.name);
    $('#rank1').val(this.Owner.rank);
    $('#team1_id').val(this.Owner.id);
  },

  updateListTeam1: function (event) {
    /* disabled: FIXME #myself doesn't exist.
  	console.log('updateListTeam1');
  
    if ($('#myself').attr('checked') === undefined) {
      var q = $("#team1").val();

	  console.log('updateListTeam1 1');

      this.playersTeam1 = new PlayersCollection();
      this.playersTeam1.setMode('search', q);
      if (q.length > 2) {
        this.playersTeam1.fetch();
        this.playersTeam1.on('sync', this.renderListTeam1, this);
      }
    }
    */
  },

  renderListTeam1: function () {
    var q = $("#team1").val();
    $(this.listview1).html(this.templates.playerlist({ players: this.playersTeam1.toJSON(), query: q, select: 1 }));
    //$(this.listview1).listview('refresh');
  },


  updateListTeam2: function (event) {
    /*
    var q = $("#team2").val();
    this.playersTeam2 = new PlayersCollection();
    this.playersTeam2.setMode('search', q);
    if (q.length > 2) {
      this.playersTeam2.fetch();

      this.playersTeam2.on('sync', this.renderListTeam2, this);
    }
    */
  },

  renderListTeam2: function () {
    var q = $("#team2").val();
    $(this.listview2).html(this.templates.playerlist({ players: this.playersTeam2.toJSON(), query: q, select: 2 }));
    //$(this.listview2).listview('refresh');
  },

  addGame: function (event) {
  
    //$.ui.toggleNavMenu(true);
  
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
    
	/*
    if (rank1 === '') {
      //alert('Il manque le joueur 1 '+$('#myself').attr('checked'));
      $('span.team1_error').html('Vous devez indiquer le classement !').show();
      return false;
    }*/

    if (team2 === '' && team2_id === '') {
      $('span.team2_error').html('Vous devez indiquer un joueur !').show();
      return false;
    }

	/*
    if (rank2 === '') {
      //alert('Il manque le joueur 1 '+$('#myself').attr('checked'));
      $('span.team2_error').html('Vous devez indiquer le classement !').show();
      return false;
    }
    */

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

  //render the content into div of view
  render: function () {
    this.$el.html(this.templates.gameadd({ playerid: this.Owner.id, token: this.Owner.token }));

    return this;
  },

  onClose: function () {
    //Clean
    this.undelegateEvents();
    if (this.playersTeam1 !== undefined) this.playersTeam1.off("all", this.renderListTeam1, this);
    if (this.playersTeam2 !== undefined) this.playersTeam2.off("all", this.renderListTeam2, this);
  }
});