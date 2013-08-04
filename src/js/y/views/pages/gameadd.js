Y.Views.Pages.GameAdd = Y.View.extend({
  el: "#content",

  pageName: "gameAdd",
  pageHash : "games/add",  

  shareTimeout: null,
  
  useSearch:0,

  team1_id: null,
  team2_id: null,
  
  events: {
    'mousedown .button': 'addGame',
    'click .form-button.other-team': 'otherTeam',
    'click .form-button.more-options': 'moreOption',
    'blur #team1': 'changeTeam1',
    'focus .nativedatepicker' : 'nativeDate',
    'focus .nativetimepicker' : 'nativeTime'
  },  

  myinitialize: function () {
    this.useSearch = 0;	
    Y.GUI.header.title(i18n.t('gameadd.title'));
    Y.GUI.addBlueBackground();

  	this.templates = {
	    gameadd:  Y.Templates.get('gameAdd'),
	    gameselect:  Y.Templates.get('gameSelect'),	    
	    gamedatepicker:  Y.Templates.get('gameDatePicker'),	
	    gamedatepickerandroid:  Y.Templates.get('gameDatePickerAndroid'),		      
	    playerlist: Y.Templates.get('playerListAutoComplete')
	};
	  
	this.player = Y.User.getPlayer();
	this.DB = new Y.DB("Y.GameAdd.");
    this.team1_id = this.player.get('id');
    this.team2_id = null;
    this.render();
  },

  otherTeam: function () {
    this.team1_id = null;
    // 
    $('.team1_error').hide();
    $('.team2_error').hide();
    
    $(".form-button.other-team").addClass("selected");
    $(".ui-grid-b.first-team").removeClass("me");
    $("#team1").prop("disabled", false);
    $("#team1").attr("placeholder", "");
    $("#team1").val('');
    // on force l'input mode
    $("#team1").focus();
    this.$("#team1").trigger("click");
  },

  moreOption: function () {
    $('.team1_error').hide();
    $('.team2_error').hide();  
    $(".form-button.more-options").toggleClass("selected");
    $("#gameAddForm").toggleClass("simple");
  },
    
  changeTeam1: function () {
    if ($("#team1").val() === "") {
      $(".form-button.other-team").removeClass("selected");
      $(".ui-grid-b.first-team").addClass("me");
      $("#team1").prop("disabled", true);
      //$("#team1").attr("placeholder", i18n.t("gameadd.player1_holder"));
      if (this.player.get('name').length > 1)
        $("#team1").val(this.player.get('name'));
      this.team1_id = this.player.get('id');
    }
  },
  
  nativeDate: function (event) {
 	var currentField = $('#'+event.currentTarget.id);	
    var myNewDate = Date.parse(currentField.val()) || new Date();
    if(typeof myNewDate === "number"){ myNewDate = new Date (myNewDate); }
    
	if (window.plugins!==undefined) {
    // Same handling for iPhone and Android
      window.plugins.datePicker.show({
        date : myNewDate,
        mode : 'date', // date or time or blank for both
        allowOldDates : false
      }, function(returnDate) {
        var dateExpected = Date.fromString(new Date(returnDate));
        var month = dateExpected.getMonth() + 1;
        var date = (''+dateExpected.getFullYear())+'-'+('0'+month).slice(-2)+'-'+('0'+dateExpected.getDate()).slice(-2);
        currentField.val(date);      
              
        // This fixes the problem you mention at the bottom of this script with it not working a second/third time around, because it is in focus.
        currentField.blur();
     });  
   }
  },
  
  nativeTime: function (event) {
 	var currentField = $('#'+event.currentTarget.id);	
    var myNewTime = new Date();

    var time = currentField.val();    
    if (time.length>3) {    
      myNewTime.setHours(time.substr(0, 2));
      myNewTime.setMinutes(time.substr(3, 2));
	}
	
    // Same handling for iPhone and Android
	if (window.plugins!==undefined) {    
      plugins.datePicker.show({
        date : myNewTime,
        mode : 'time', // date or time or blank for both
        allowOldDates : true
      }, function(returnDate) {
        currentField.val(returnDate);
        currentField.blur();
      });
    }  
  },  
  

  addingGame: false,
  addGame: function (event) {
    var team1 = $('#team1').val()   
      , team2 = $('#team2').val()
      , rank2 = $('#rank2').val()
      , city = $('#city').val()
      , expectedDay = $('#expectedDay').val() 
      , expectedHour = $('#expectedHour').val()
      , game;
      
      
    if (this.addingGame)
      return; // already sending => disabled.    

    if (( team1.length < 3 || team1.indexOf('  ')!==-1 ) &&
        this.team1_id != this.player.get('id')) {
      $('.team1_error').html(i18n.t('message.error_emptyplayer')+' !').show();
      $('#team1').val('');
      return false;
    }
    
    //On redirige vers le formulaire special
    if (team1 === '' && this.team1_id == this.player.get('id')) {
      //$('.team1_error').html(i18n.t('message.error_emptyyou')+' !').show();      
      //On sauvegarde les infos de la partie
      game = {
          team1 : team1
        , rank1 : $('#rank1').val()
        , team1_id : this.team1_id
        , team2 : team2
        , rank2 : $('#rank2').val()
        , team2_id : this.team2_id
        , location : { city : $('#city').val() }
        , infos : { 
        court : $('#court').val() 
          , surface : $('#surface').val()
          , tour : $('#tour').val() 
          , official : ($('#official').val() === "true")
          //Stocke infos temporaire sans rapport avec le modele
          , expectedDay : $('#expectedDay').val()
          , expectedHour : $('#expectedHour').val()
        } 
      };


      this.DB.saveJSON("game", game);
      Y.Router.navigate("players/form/me", {trigger: true});	
      
        
      return false;
    }

    //return false;
    $("span[class*='_error']").hide();

    if (checkName(team1) && team1.length>0) {     
	   $('.team1_error').html(i18n.t('message.bad_name')+' !').show();
      $('#team1').val('');        
      return false;	   
    };
    
    if (checkName(team2) && team2.length>0) { 
	    $('.team2_error').html(i18n.t('message.bad_name')+' !').show();
      $('#team2').val('');        
      return false;	   
    };
    
    if (checkRank(rank2) && rank2.length>0) {
  	  $('.team2_error').html(i18n.t('message.bad_rank')+' !').show();
      $('#rank2').val('');        
      return false;	   
    };    

    if ( ( team2.length < 3  || team2.indexOf('  ')!==-1 ) && this.team2_id === null ) {
      $('.team2_error').html(i18n.t('message.error_emptyplayer')+' !').show();
      $('#team2').val('');
      return false;
    };
    
    if (checkName(city) && city.length>0) {             
	  $('span.city_error').html(i18n.t('message.bad_name')+' !').show();
      $('#city').val('');        
      return false;	   
    };

	if (expectedDay.length < 1 && expectedHour.length > 1) {
	  $('span.expected_error').html(i18n.t('message.expected_error')+' !').show();	      
	  return false;	 
	}

	if (expectedDay.length > 1 && expectedHour.length < 1) {
	  $('span.expected_error').html(i18n.t('message.expected_error')+' !').show();	    
	  return false;	 
	}

    // on evite que l'utilisateur qui double tap, envoie 2 comments
    this.addingGame = true;

    // On sauve dans Collections
    game = new GameModel({
      team1 : team1
    , rank1 : $('#rank1').val()
    , team1_id : this.team1_id
    , team2 : team2
    , rank2 : $('#rank2').val()
    , team2_id : this.team2_id
    , location : { city : $('#city').val() }
    , dates : {}
    , infos : { 
        court : $('#court').val() 
      , surface : $('#surface').val()
      , tour : $('#tour').val()
      , official : ($('#official').val() === "true")
      }
    });   
    
    var date = $('#expectedDay').val();
    var time = $('#expectedHour').val();   
      
    //on reforme la date 
    if (date!=='' && time!=='') {
      var datetime = date.toString('yyyy-MM-dd')+' '+time.toString('h:mm');      
      game.get("dates").expected = datetime;      
    }

    var that = this;
    	
    game.save(null, {
	    playerid: this.player.get('id'),
	    token: this.player.get('token')
	  }).done(function(model, response){
	    that.addingGame = false; 
	    Y.Router.navigate('games/'+model.id, {trigger: true}); 
	  }).fail(function (err) {
	    that.$(".button").addClass("ko");
	    that.shareTimeout = window.setTimeout(function () {
	      that.$(".button").removeClass("ko");
	      that.shareTimeout = null;
	  	  that.$('.button').removeClass("disabled");    
	    }, 4000);
      that.addingGame = false;	 
	 });
  },

  autocompletePlayers: function (input, callback) {
    if (input.indexOf('  ')!==-1 || input.length<= 1 )
      callback('empty');		
    
    Backbone.ajax({
      url: Y.Conf.get("api.url.autocomplete.players"),
      type: 'GET',
      dataType : 'json',
      data: { q: input }
    }).done(function (players) {
      if (players && _.isArray(players) && players.length>0) {
        callback(null, players.splice(0, 3).map(function (p) {
          p.text = p.name; 
          //FIXME : add rank
          if (p.club !== undefined && p.club.name !== undefined) {
	          p.text += " ( "+p.club.name+" )";
	        }
          return p; 
        }));
      } else {
        callback(null, []);
      }
    }).fail(function (xhr, error) { 
      callback(error);
    });
  },

  autocompleteTeam1: function (data) {
    if (data && data.name) {
      this.$("#team1").val(data.name);
      this.team1_id = data.id;
    }
  },

  autocompleteTeam2: function (data) {

    if (data && data.name) {
      this.$("#team2").val(data.name);
      this.team2_id = data.id;
    }
  }, 

  //render the content into div of view
  render: function () {
    this.$el.html(this.templates.gameadd());
    if (this.player.get('name'))
      $("#team1").val(this.player.get('name')); 
    if (this.player.get('id') !== "")
      this.team1_id = this.player.get('id');

    /*
    debug android 2.2 to 2.3.6
    */
	 $('#inject-select').prepend(this.templates.gameselect({ 
	    selection : i18n.t('gameadd.selection')
	    , surface : i18n.t('gameadd.surface')
     })); 	 
	 
	 if (Cordova.Device.isGingerbread)
	   $('#inject-datepicker').prepend(this.templates.gamedatepickerandroid({}));
	 else
     $('#inject-datepicker').prepend(this.templates.gamedatepicker({}));
	   
    //fill with last data 
    if (this.DB !== undefined) {
      var game = this.DB.readJSON("game"); 
      
      if (game!==undefined) {

	      $("#team2").val(game.team2); 
	      this.team2_id = game.team2_id;
	      $("#rank2").val(game.rank2);                
	    
	      if ( game.location.city !== "" ) $("#city").val(game.location.city);    
	      if ( game.infos.surface !== "" ) $("#surface").val(game.infos.surface);
	      if ( game.infos.tour !== "" ) $("#tour").val(game.infos.tour);
	      if ( game.infos.court !== "" ) $("#court").val(game.infos.court);
	      if ( game.infos.official !== "" ) $("#official").val(game.infos.official);	
	      if ( game.infos.expectedDay !== "" ) $("#expectedDay").val(game.infos.expectedDay);
	      if ( game.infos.expectedHour !== "" ) $("#expectedHour").val(game.infos.expectedHour);		      	      

        this.DB.remove("game"); 
      }
    }
    $('#content').i18n();
    return this;
  },

  onClose: function () {
  
    this.undelegateEvents();
    
    //Y.GUI.header.show();
    Y.GUI.delBlueBackground();
    
    if (this.shareTimeout) {
      window.clearTimeout(this.shareTimeout);
      this.shareTimeout = null;
    }   
  
    if (this.playersTeam1 !== undefined) this.playersTeam1.off("all", this.renderListTeam1, this);
    if (this.playersTeam2 !== undefined) this.playersTeam2.off("all", this.renderListTeam2, this);
	this.confirmGameAdd = true;  
  } 
  
});