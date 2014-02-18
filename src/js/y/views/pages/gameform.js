Y.Views.Pages.GameForm = Y.View.extend({
  el:"#content",
    
  pageName: "gameForm",
  pageHash : "games/form",  
      
  events: {
    'click #startTeam1'            : 'startTeam1',
    'click #startTeam2'            : 'startTeam2',      
    'click #deleteMatch'           : 'deleteGame',    
    'mousedown .link-form>.button' : 'updateGame',
    'keyup #club'                  : 'updateList',
    'click #club_choice'           : 'displayClub',
    'focus .nativedatepicker'      : 'nativeDate',
    'focus .nativetimepicker'      : 'nativeTime'
  },
  
  listview:"#suggestions",
  
  confirmTimeout: null,
    
  clubs:null,
  useSearch:null,

  myinitialize:function() {
    //header
    Y.GUI.header.title(i18n.t('gameform.title')); 
    
    //no search
    this.useSearch=0;

    this.templates = {
      pagesimple:  Y.Templates.get('page-gameform-simple'),
      pagedouble:  Y.Templates.get('page-gameform-double'),      
      gameselect:  Y.Templates.get('module-game-select'),      
      gamedatepicker:  Y.Templates.get('datepicker-game'),  
      gamedatepickerandroid:  Y.Templates.get('datepicker-game-android'),              
      playerlist: Y.Templates.get('list-player')
    };
    
    this.player = Y.User.getPlayer();
  
    this.game = new GameModel({id : this.id});                      
    this.game.on("sync", this.render,this);
    this.game.fetch();
  },
  
  updateList: function (event) {
    var q = $("#club").val();    
    this.clubs = new ClubsCollection();
    this.clubs.setMode('search',q);
    if (q.length>2) {
      this.clubs.fetch();
      this.useSearch=1
      this.clubs.on( 'sync', this.renderList, this );
    }
  },
    
  renderList: function () {
    var q = $("#club").val();
    
    $(this.listview).html(this.clubListAutoCompleteViewTemplate({clubs:this.clubs.toJSON(), query:q}));
  },
    
    
  displayClub: function(li) {
    selectedId = $('#club_choice:checked').val();
    selectedName = $('#club_choice:checked').next('label').text();
    $('#club').val(selectedName);
    //FIXME : differencier idclub et fftid
    $('#clubid').val(selectedId); 
    $('club_error').html('');
    $(this.listview).html('');
  },

  confirmDeletion: false,
  deleteGame: function (event) {
    if (!this.confirmDeletion) {
      $("#deleteMatch").text(i18n.t("gameform.confirmdelete"));
      this.confirmDeletion = true;
    } else {
      return Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") + this.id + '/?playerid='+this.player.get('id')+'&token='+this.player.get('token')+'&_method=delete',
        type : 'POST',
        success : function(result) {
          Y.Router.navigate('/games/add', {trigger: true});     
        }
      });
    }
    return false;
  },
    
  // on stoque les modifs dans la GUI.  
  startTeam1 : function() {
    $('#startTeam1').parent().addClass("select");
    $('#startTeam2').parent().removeClass("select");
  },
  
  startTeam2 : function() {
    $('#startTeam1').parent().removeClass("select");
    $('#startTeam2').parent().addClass("select");
  },

  save: function () {
    return this.game.save(null, {playerid: this.player.get('id'), token: this.player.get('token')});
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
  
  updateGame: function (event) {
    // first, check the form.
    var team1 = $("#team1").val()
      , team2 = $("#team2").val()
      , team3 = $("#team3").val()
      , team4 = $("#team4").val()
      
      , rank1 = $("#rank1").val()
      , rank2 = $("#rank2").val()
      , rank3 = $("#rank3").val()
      , rank4 = $("#rank4").val()      
      
      , ownedPlayer = null
      , expectedDay = $('#expectedDay').val() 
      , expectedHour = $('#expectedHour').val()      
      , that = this;

	if (this.game.get('infos').type==="doubles") {
	  
	  if (this.isTeamEditable(0,0)) {
	    if (checkName(team1) && team1.length>0) {
	      $('span.team1_error').html(i18n.t('message.bad_name')+' !').show();
	      $('#team1').val('');
	      return false;
	    }
	    if (checkRank(rank1) && rank1.length>0) {
	      $('span.team1_error').html(i18n.t('message.bad_rank')+' !').show();
	      $('#rank1').val('');        
	      return false;     
	    }
	  }
	  if (this.isTeamEditable(0,1)) {
	    if (checkName(team2) && team2.length>0) { 
	      $('span.team2_error').html(i18n.t('message.bad_name')+' !').show();
	      $('#team2').val('');
	      return false;
	    }
	    if (checkRank(rank2) && rank2.length>0) {
	      $('span.team2_error').html(i18n.t('message.bad_rank')+' !').show();
	      $('#rank2').val('');
	      return false;
	    }
	  }	    
	  if (this.isTeamEditable(1,0)) {
	    if (checkName(team3) && team3.length>0) {
	      $('span.team3_error').html(i18n.t('message.bad_name')+' !').show();
	      $('#team3').val('');
	      return false;
	    }
	    if (checkRank(rank3) && rank3.length>0) {
	      $('span.team3_error').html(i18n.t('message.bad_rank')+' !').show();
	      $('#rank3').val('');        
	      return false;     
	    }
	  }
	  if (this.isTeamEditable(1,1)) {
	    if (checkName(team4) && team4.length>0) { 
	      $('span.team4_error').html(i18n.t('message.bad_name')+' !').show();
	      $('#team4').val('');
	      return false;
	    }
	    if (checkRank(rank4) && rank4.length>0) {
	      $('span.team4_error').html(i18n.t('message.bad_rank')+' !').show();
	      $('#rank4').val('');
	      return false;
	    }
	  }	
	}
	else {
	  if (this.isTeamEditable(0,0)) {
	    if (checkName(team1) && team1.length>0) {
	      $('span.team1_error').html(i18n.t('message.bad_name')+' !').show();
	      $('#team1').val('');
	      return false;
	    }
	    if (checkRank(rank1) && rank1.length>0) {
	      $('span.team1_error').html(i18n.t('message.bad_rank')+' !').show();
	      $('#rank1').val('');        
	      return false;     
	    }
	  }
	  if (this.isTeamEditable(1,0)) {
	    if (checkName(team2) && team2.length>0) { 
	      $('span.team2_error').html(i18n.t('message.bad_name')+' !').show();
	      $('#team2').val('');
	      return false;
	    }
	    if (checkRank(rank2) && rank2.length>0) {
	      $('span.team2_error').html(i18n.t('message.bad_rank')+' !').show();
	      $('#rank2').val('');
	      return false;
	    }
	  }
	}
    
    if (expectedDay.length < 1 && expectedHour.length > 1) {
      $('span.expected_error').html(i18n.t('message.expected_error')+' !').show();        
      return false;   
    }

    if (expectedDay.length > 1 && expectedHour.length < 1) {
      $('span.expected_error').html(i18n.t('message.expected_error')+' !').show();      
      return false;   
    }
    
    // then, we save the player only if modified && owned.
    var promises = [];
    
    if (this.game.get('infos').type==="doubles") {
    
	  if (this.isTeamEditable(0,0) &&
	      (team1 !== this.game.get('teams')[0].players[0].name ||
	       rank1 !== this.game.get('teams')[0].players[0].rank)) {
	    // enregistrement de la modif sur ce player owned.
	    ownedPlayer = new PlayerModel({ 
	      id: this.game.get('teams')[0].players[0].id,
	      name: team1,
	      rank: rank1
	    });
	    promises.push(ownedPlayer.save(null, {
	      playerid: this.player.get('id'),
	      token: this.player.get('token')
	    }));
	  }
	
    if (this.isTeamEditable(0,1) &&
       (team2 !== this.game.get('teams')[0].players[1].name ||
        rank2 !== this.game.get('teams')[0].players[1].rank)) {
      // enregistrement de la modif sur ce player owned.
      ownedPlayer = new PlayerModel({ 
        id: this.game.get('teams')[0].players[1].id,
        name: team2,
        rank: rank2
      });
      promises.push(ownedPlayer.save(null, {
        playerid: this.player.get('id'),
        token: this.player.get('token')
      }));
     }    

	 if (this.isTeamEditable(1,0) &&
	      (team3 !== this.game.get('teams')[1].players[0].name ||
	       rank3 !== this.game.get('teams')[1].players[0].rank)) {
	   // enregistrement de la modif sur ce player owned.
	   ownedPlayer = new PlayerModel({ 
	     id: this.game.get('teams')[1].players[0].id,
	     name: team3,
	     rank: rank3
	   });
	   promises.push(ownedPlayer.save(null, {
	     playerid: this.player.get('id'),
	     token: this.player.get('token')
	   }));
	}
	
    if (this.isTeamEditable(1,1) &&
       (team4 !== this.game.get('teams')[1].players[1].name ||
        rank4 !== this.game.get('teams')[1].players[1].rank)) {
      // enregistrement de la modif sur ce player owned.
      ownedPlayer = new PlayerModel({ 
        id: this.game.get('teams')[1].players[1].id,
        name: team4,
        rank: rank4
      });
      promises.push(ownedPlayer.save(null, {
        playerid: this.player.get('id'),
        token: this.player.get('token')
      }));
     } 
    }
    // mode simples
    else {
	  if (this.isTeamEditable(0,0) &&
	      (team1 !== this.game.get('teams')[0].players[0].name ||
	       rank1 !== this.game.get('teams')[0].players[0].rank)) {
	    // enregistrement de la modif sur ce player owned.
	    ownedPlayer = new PlayerModel({ 
	      id: this.game.get('teams')[0].players[0].id,
	      name: team1,
	      rank: rank1
	    });
	    promises.push(ownedPlayer.save(null, {
	      playerid: this.player.get('id'),
	      token: this.player.get('token')
	    }));
	  }
	
    if (this.isTeamEditable(1,0) &&
       (team2 !== this.game.get('teams')[1].players[0].name ||
        rank2 !== this.game.get('teams')[1].players[0].rank)) {
      // enregistrement de la modif sur ce player owned.
      ownedPlayer = new PlayerModel({ 
        id: this.game.get('teams')[1].players[0].id,
        name: team2,
        rank: rank2
      });
      promises.push(ownedPlayer.save(null, {
        playerid: this.player.get('id'),
        token: this.player.get('token')
      }));
     }
   }

   // une fois les players enregistrés, on peut enregistrer la game.
   $.when(promises)
     .always(_.bind(function () {
      // on drop les erreurs sur l'enregistrement de players.
      // FIXME : gestion date de debut    
      // FIXME: team1_id n'est pas un id de team, mais un id de player.
      this.game.get('location').city = $('#city').val();
      this.game.get('infos').court = $('#court').val();
      this.game.get('infos').surface = $('#surface').val();
      this.game.get('infos').tour = $('#tour').val();
      
      if ($('#official').val()==="false")
        this.game.get('infos').official = false;
      else     
        this.game.get('infos').official = true; 

      var date = $('#expectedDay').val();
      var time = $('#expectedHour').val();   
          
      //on reforme la date 
      if (date!=='' && time!=='') {
        this.game.get("dates").expected = date.toString('yyyy-MM-dd')+' '+time.toString('h:mm');
      }
      
      if ($('#startTeam1').parent().hasClass("select"))
        this.game.get('infos').startTeam = this.game.get('teams')[0].id;
      if ($('#startTeam2').parent().hasClass("select"))
        this.game.get('infos').startTeam = this.game.get('teams')[1].id;
      
      this.save().done(function (result) {
        if (!that.unloaded) {
          if (that.game.get('infos').startTeam == that.game.get('teams')[0].id) {
            $('#startTeam1').parent().addClass("select");
          } else if (that.game.get('infos').startTeam == that.game.get('teams')[1].id) {
            $('#startTeam2').parent().addClass("select");
          }
        }
      });
    }, this));
  },
  
  inputModeOn: function (e) {
    // calling parent.
    var r = Y.View.prototype.inputModeOn.apply(this, arguments);
    this.scrollBottom();
    return r;
  },

  inputModeOff: function (e) {
    // calling parent.
    var r = Y.View.prototype.inputModeOff.apply(this, arguments);
    this.scrollBottom();
    return r;
  },  
  
  //render the content into div of view
  render: function(){
    Y.GUI.addBlueBackground();  
    var game = this.game.toJSON();
    
    if (game.infos.type==="doubles") {
      this.$el.html(this.templates.pagedouble({
      game : game
      , selection : i18n.t('gameadd.selection')
      , surface : i18n.t('gameadd.surface')
      }));    
    }
    //mode simple
 	else {
      this.$el.html(this.templates.pagesimple({
      game : game
      , selection : i18n.t('gameadd.selection')
      , surface : i18n.t('gameadd.surface')
      }));
    }
    
    $('#inject-select').prepend(this.templates.gameselect({ 
      selection : i18n.t('gameadd.selection')
      , surface : i18n.t('gameadd.surface')
    }));

   if (Cordova.Device.isGingerbread)
     $('#inject-datepicker').prepend(this.templates.gamedatepickerandroid({}));     
   else
    $('#inject-datepicker').prepend(this.templates.gamedatepicker({}));

    if (game.teams[0].id === this.game.get('infos').startTeam) {
      $('#startTeam1').parent().addClass("select");
    }
    else if (game.teams[1].id === this.game.get('infos').startTeam) {
      $('#startTeam2').parent().addClass("select");
    }             

    // can we modify players ?
    if (game.infos.type==="doubles") {
      
      if (game.teams[0].players[0].name !== undefined ) $("#team1").val(game.teams[0].players[0].name);
      if (game.teams[0].players[0].rank !== undefined ) $("#rank1").val(game.teams[0].players[0].rank);    
      if (game.teams[0].players[1].name !== undefined ) $("#team2").val(game.teams[0].players[1].name);    
      if (game.teams[0].players[1].rank !== undefined ) $("#rank2").val(game.teams[0].players[1].rank);        
      if (game.teams[1].players[0].name !== undefined ) $("#team3").val(game.teams[1].players[0].name);    
      if (game.teams[1].players[0].rank !== undefined ) $("#rank3").val(game.teams[1].players[0].rank);  
      if (game.teams[1].players[1].name !== undefined ) $("#team4").val(game.teams[1].players[1].name);    
      if (game.teams[1].players[1].rank !== undefined ) $("#rank4").val(game.teams[1].players[1].rank);  
                  
      if (!this.isTeamEditable(0,0)) {
        $("#team1,#rank1").prop('disabled', true); // team1 is ME or, some player I don't own.
      }

      if (!this.isTeamEditable(0,1)) {
        $("#team2,#rank2").prop('disabled', true); // team2 is ME or, some player I don't own.
      }   
       
      if (!this.isTeamEditable(1,0)) {
        $("#team3,#rank3").prop('disabled', true); // team3 is ME or, some player I don't own.
      }

      if (!this.isTeamEditable(1,1)) {
        $("#team4,#rank4").prop('disabled', true); // team4 is ME or, some player I don't own.
      }   
    }
    else {
    
      if (game.teams[0].players[0].name !== undefined ) $("#team1").val(game.teams[0].players[0].name);
      if (game.teams[0].players[0].rank !== undefined ) $("#rank1").val(game.teams[0].players[0].rank);    
      if (game.teams[1].players[0].name !== undefined ) $("#team2").val(game.teams[1].players[0].name);    
      if (game.teams[1].players[0].rank !== undefined ) $("#rank2").val(game.teams[1].players[0].rank);       
    
      if (!this.isTeamEditable(0,0)) {
        $("#team1,#rank1").prop('disabled', true); // team1 is ME or, some player I don't own.
      }

      if (!this.isTeamEditable(1,0)) {
        $("#team2,#rank2").prop('disabled', true); // team2 is ME or, some player I don't own.
      }
    }
    
    if (game.dates.expected !== undefined) {  
      var dateExpected = Date.fromString(game.dates.expected);
      $('#expectedDay').val(dateExpected.toYYYYMMDD('-'));
      $('#expectedHour').val(dateExpected.toHHMM(':'));
    }    
    
    if (game.location.city !== undefined) $("#city").val(game.location.city); 
    if (game.infos.surface !== undefined) $("#surface").val(game.infos.surface);
    if (game.infos.tour !== undefined) $("#tour").val(game.infos.tour);
    if (game.infos.court !== undefined) $("#court").val(game.infos.court);
          
    if (typeof game.infos.official === "boolean") {
      $("#official").val(game.infos.official?"true":"false");
    }

    if (typeof game.infos.numberOfBestSets === "number") {
      if (game.infos.numberOfBestSets == 5)
        $("#5sets").prop('checked', true);
      else
        $("#3sets").prop('checked', true);
    }
    //On ne peut plus modifier le nombre de sets une fois la partie créé
    $("#5sets").prop('disabled', true);
    $("#3sets").prop('disabled', true);

    console.log('numberOfBestSets',game.infos.numberOfBestSets);

    if (typeof game.infos.maxiSets === "number") {
        if (game.infos.maxiSets == 5)
            $("#5maxisets").prop('checked', true);
        else
            $("#3maxisets").prop('checked', true);
    }
    //On ne peut plus modifier le nombre de sets une fois la partie créé
    $("#5maxisets").prop('disabled', true);
    $("#6maxisets").prop('disabled', true);

    console.log('maxiSets',game.infos.maxiSets);

    this.$el.i18n();

    this.startMonitoringModifications();
  },

  isTeamEditable: function (teamId,position) {
    var teamPlayer = this.game.get('teams')[teamId].players[position];

    return teamPlayer.id !== this.player.get('id') &&
           teamPlayer.owner !== undefined &&
           teamPlayer.owner === this.player.get('id');
  },

  startMonitoringModifications: function () {
    if (this.modificationMonitoringIntervalId)
      return; // do not monitor twice.
    // if modified => button orange.
    this.modificationMonitoringIntervalId = window.setInterval(_.bind(function () {
      if (this.hasBeenModified())
        $("#saveGame").addClass("modified");
      else
        $("#saveGame").removeClass("modified");
    }, this), 1000);
  },

  stopMonitoringModifications: function () {
    if (this.modificationMonitoringIntervalId) {
      window.clearInterval(this.modificationMonitoringIntervalId);
      this.modificationMonitoringIntervalId = null;
    }
  },

  hasBeenModified: function () {
    var game = this.game.toJSON();
    
    // check qui a le service
    if ((game.teams[0].id === game.infos.startTeam &&
         ! $('#startTeam1').parent().hasClass("select")) ||
        (game.teams[1].id === game.infos.startTeam &&
         ! $('#startTeam2').parent().hasClass("select")) ||
        (typeof game.infos.startTeam === "undefined" &&
         ($('#startTeam1').parent().hasClass("select") ||
          $('#startTeam2').parent().hasClass("select"))))
      return true;
    // check les dates
    if (typeof game.dates.expected === "undefined" && 
        ($('#expectedDay').val() !== "" ||
         $('#expectedHour').val() !== ""))
      return true;
    if (game.dates.expected) {
      var dateExpected = Date.fromString(game.dates.expected);
      if ($('#expectedDay').val().isDifferentFrom(dateExpected.toYYYYMMDD('-')) ||
          $('#expectedHour').val().isDifferentFrom(dateExpected.toHHMM(':')))
        return true;
    }
    
    if (game.infos.type==="doubles") {
      if ( $("#team1").val().isDifferentFrom(game.teams[0].players[0].name) ||
           $("#rank1").val().isDifferentFrom(game.teams[0].players[0].rank) ||
           $("#team2").val().isDifferentFrom(game.teams[0].players[1].name) ||
           $("#rank2").val().isDifferentFrom(game.teams[0].players[1].rank) ||
           $("#team3").val().isDifferentFrom(game.teams[1].players[0].name) ||
           $("#rank3").val().isDifferentFrom(game.teams[1].players[0].rank) ||        
           $("#team4").val().isDifferentFrom(game.teams[1].players[1].name) ||
           $("#rank4").val().isDifferentFrom(game.teams[1].players[1].rank)        
        ) {
        return true;      
      }     
    }
    else {
      if ( $("#team1").val().isDifferentFrom(game.teams[0].players[0].name) ||
           $("#rank1").val().isDifferentFrom(game.teams[0].players[0].rank) ||
           $("#team2").val().isDifferentFrom(game.teams[1].players[0].name) ||
           $("#rank2").val().isDifferentFrom(game.teams[1].players[0].rank) ) {
        return true;      
      }   
    }
    
    // check le reste des infos
    return $("#city").val().isDifferentFrom(game.location.city) ||
           $("#surface").val().isDifferentFrom(game.infos.surface) ||
           $("#tour").val().isDifferentFrom(game.infos.tour) ||
           $("#court").val().isDifferentFrom(game.infos.court) ||
           $("#official").val().isDifferentFrom(String(game.infos.official));
  },

  // @param callback function(err, canClose) { }
  canClose: function (callback) {
    // si rien n'est modifié => OK
    if (!this.hasBeenModified())
      return callback(null, true);

    // autrement, on prompt l'utilisateur
    navigator.notification.confirm(
      // chrome affiche "OK" / "CANCEL"
      // cordova affichera "OUI" / "ANNULER"
      // numéro du bouton   1 / 2
      i18n.t('message.savemessage'), // message
      function(buttonIndex){
        if (buttonIndex==1) {
          callback(null, true);
        }
        else {
          callback(null, false);
        }
      },  // callback
      i18n.t('message.savetitle'), // title
      i18n.t('message.saveyes')+','+i18n.t('message.savecancel') // buttonName
    );
  },

  onClose: function() {
    Y.GUI.delBlueBackground();
  
    this.game.off("sync", this.render, this);
    if (this.useSearch===1)
      this.clubs.off("sync", this.renderList,this);
      
    if (this.confirmTimeout) {
      window.clearTimeout(this.confirmTimeout);
      this.confirmTimeout = null;
    } 

    this.stopMonitoringModifications();
  }
});