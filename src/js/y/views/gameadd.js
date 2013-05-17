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
  playerid: "",
  token: "",
  
  useSearch:0,

  myinitialize: function () {
    this.useSearch = 0;	
    Y.GUI.header.title(i18n.t('gameadd.title'));
  	this.templates = {
	    gameadd:  Y.Templates.get('gameAdd'),
	    playerlist: Y.Templates.get('playerListAutoComplete')
	  };
	this.owner = Y.User.getPlayer();    
    this.token = this.owner.get('token');
    this.playerid = this.owner.get('id');
	this.render();
  },

  otherTeam: function () {
    $('span.team1_error').hide();
    $('span.team2_error').hide();
    
    $(".form-button.other-team").addClass("selected");
    $(".ui-grid-b.first-team").removeClass("me");
    $("#team1").prop("disabled", false);
    $("#team1_id").val('');
    $("#team1").attr("placeholder", "");
    // on force l'input mode
    $("#team1").focus();
    this.$("#team1").trigger("click");
  },

  moreOption: function () {
  
    $('span.team1_error').hide();
    $('span.team2_error').hide();  
  
    $(".form-button.more-options").toggleClass("selected");
    $("#gameAddForm").toggleClass("simple");
  },
    
  changeTeam1: function () {
    if ($("#team1").val() == "") {
      $(".form-button.other-team").removeClass("selected");
      $(".ui-grid-b.first-team").addClass("me");
      $("#team1").prop("disabled", true);
      $("#team1").attr("placeholder", i18n.t("gameadd.player1_holder"));
      $("#team1_id").val(this.owner.get('id'));
    }
  },

  addGame: function (event) {
  
    var team1 = $('#team1').val()    
      , team1_id = $('#team1_id').val()
      , team2 = $('#team2').val()
      , city = $('#city').val()
      , team2_id = $('#team2_id').val();

    if ( ( team1.length < 3 || team1.indexOf('  ')!==-1 ) && !$('#team1').is(':disabled') ) {
      $('span.team1_error').html(i18n.t('message.error_emptyplayer')+' !').show();
      $('#team1').val('');
      return false;
    }
    
    //On redirige vers le formulaire special
    if ( team1 === ''   && $('#team1').is(':disabled') ) {
      //$('span.team1_error').html(i18n.t('message.error_emptyyou')+' !').show();
      Y.Router.navigate("players/form/me", {trigger: true});	  
      return false;
    }    
    
    //console.log(team2.length);
    //return false;
    $("span[class*='_error']").hide();

    if ( ( team2.length < 3  || team2.indexOf('  ')!==-1 ) && team2_id === '' ) {
      $('span.team2_error').html(i18n.t('message.error_emptyplayer')+' !').show();
      $('#team2').val('');
      return false;
    }

    if (checkName(team1)) {     
	  $('span.team1_error').html(i18n.t('message.bad_name')+' !').show();
      $('#team1').val('');        
      return false;	   
    }
    
    if (checkName(team2)) { 
	  $('span.team2_error').html(i18n.t('message.bad_name')+' !').show();
      $('#name').val('');        
      return false;	   
    }
    
    if (checkName(city)) {             
	  $('span.city_error').html(i18n.t('message.bad_name')+' !').show();
      $('#city').val('');        
      return false;	   
    }        


    var game = {
		team1 : team1
      , rank1 : $('#rank1').val()
      , team1_id : team1_id
      , team2 : team2
      , rank2 : $('#rank2').val()
      , team2_id : team2_id
      , city : city
      , court : $('#court').val()
      , surface : $('#surface').val()
      , tour : $('#tour').val()
      , subtype : $('#subtype').val()
      , playerid : this.playerid
      , token : this.token      
    };
    
    //On sauve dans Collections
    var game = new GameModel(game);    
    game.save({}, {  
      success: function(model, response){
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
    
    if (input.indexOf('  ')!==-1 || input.length<= 1 )
      callback('empty');		
    
    Backbone.ajax({
      url: Y.Conf.get("api.url.autocomplete.players"),
      type: 'GET',
      dataType : 'json',
      data: { q: input }
    }).done(function (players) {
      if (players && _.isArray(players) && players.length>0) {
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
    if (data && data.name) {
      this.$("#team1").val(data.name);
      this.$("#team1_id").val(data.id);
    }
  },

  autocompleteTeam2: function (data) {
    console.log("autocomplete data: " + JSON.stringify(data));
    if (data && data.name) {
      this.$("#team2").val(data.name);
      this.$("#team2_id").val(data.id);      
    }
  },

  //render the content into div of view
  render: function () {
    this.$el.html(this.templates.gameadd({ 
	    selection : i18n.t('gameadd.selection')
	    , surface : i18n.t('gameadd.surface')
     }));
    
    //this.$el.i18n();
	  $('#content').i18n();
	 
	 if ( this.owner.get('name') !== "" ) $("#team1").val(this.owner.get('name')); 
	 if ( this.owner.get('id') !== "" ) $("#team1_id").val(this.owner.get('id')); 	
		
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