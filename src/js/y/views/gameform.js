Y.Views.GameForm = Y.View.extend({
  el:"#content",
    
  events: {
    // mode "input"
    'focus input[type="text"]': 'inputModeOn',
    'blur input[type="text"]': 'inputModeOff',
    //
    'click #startTeam1'     : 'startTeam1',
    'click #startTeam2'     : 'startTeam2',      
    'click #deleteMatch': 'deleteMatch',    
    'click #updateGame':'update',
    'keyup #club': 'updateList',
    'click #club_choice' : 'displayClub'
  },
  
  listview:"#suggestions",

  pageName: "gameForm",
  pageHash : "games/form",  
  
  confirmTimeout: null,
    
  clubs:null,
  useSearch:null,

  myinitialize:function() {
	  //header
    Y.GUI.header.title(i18n.t('gameform.title')); 
    
    //no search
    this.useSearch=0;
    
  	this.templates = {
	    gameform:  Y.Templates.get('gameForm'),
	    gameselect:  Y.Templates.get('gameSelect'),	    
	    gameinput:  Y.Templates.get('gameInput'),	      
	    playerlist: Y.Templates.get('playerListAutoComplete')
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
  deleteMatch: function (event) {
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
    this.game.get('infos').startTeam = 0;
  },
  
  startTeam2 : function() {
    $('#startTeam1').parent().removeClass("select");
    $('#startTeam2').parent().addClass("select");
  },

  renderAndSave: function () {
    this.render();
    return this.game.save(null, {playerid: this.player.get('id'), token: this.player.get('token')});
  },
      
  update: function (event) {
    // first, check the form.
    var team1 = $("#team1").val()
      , team2 = $("#team2").val()
      , rank1 = $("#rank1").val()
      , rank2 = $("#rank2").val()
      , ownedPlayer = null
      , that = this;

    if (this.isTeamEditable(0)) {
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
    if (this.isTeamEditable(1)) {
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
    
    // then, we save the player only if modified && owned.
    var promises = [];
    if (this.isTeamEditable(0) &&
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

    if (this.isTeamEditable(1) &&
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
      if ($('#startTeam1').parent().hasClass("select"))
        this.game.get('infos').startTeam = 0;
      if ($('#startTeam2').parent().hasClass("select"))
        this.game.get('infos').startTeam = 1;
      this.renderAndSave().done(function (result) {
        if (!that.unloaded) {
          // uniquement si nous sommes tjs sur cette page.
	        $('span.success').css({display:"block"});
	        $('span.success').html(i18n.t('message.updateok')).show();
	         
            /*
            this.confirmTimeout = window.setTimeout(function () {
		      Y.Router.navigate('/games/'+that.game.get('id'), {trigger: true});
		      that.confirmTimeout = null;
		    }, 2000);
		    */
	        
        }
      });
    }, this));
  },
  
  //render the content into div of view
  render: function(){
    var game = this.game.toJSON();

    this.$el.html(this.templates.gameform({
    game : game
    , selection : i18n.t('gameadd.selection')
	  , surface : i18n.t('gameadd.surface')
    }));
    
   	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	  var isGingerbread = /android 2\.3/i.test(userAgent);
	  if (!isGingerbread) {
		  $('#inject-select').prepend(this.templates.gameselect({ 
		    selection : i18n.t('gameadd.selection')
		  , surface : i18n.t('gameadd.surface')
	    }));
    } else {
      $('#inject-select').prepend(this.templates.gameinput());
    }
  
    if (game.teams[0].id === game.infos.startTeam) {
	    $('#startTeam1').parent().addClass("select");
    }
    else if (game.teams[1].id === game.infos.startTeam) {
	    $('#startTeam2').parent().addClass("select");
    }

    if (game.teams[0].players[0].name !== undefined ) $("#team1").val(game.teams[0].players[0].name);
    if (game.teams[0].players[0].rank !== undefined ) $("#rank1").val(game.teams[0].players[0].rank);    
    if (game.teams[1].players[0].name !== undefined ) $("#team2").val(game.teams[1].players[0].name);    
    if (game.teams[1].players[0].rank !== undefined ) $("#rank2").val(game.teams[1].players[0].rank);                

    // can we modify players ?
    if (!this.isTeamEditable(0)) {
      $("#team1,#rank1").prop('disabled', true); // team1 is ME or, some player I don't own.
    }

    if (!this.isTeamEditable(1)) {
      $("#team2,#rank2").prop('disabled', true); // team1 is ME or, some player I don't own.
    }
    
    if (!isGingerbread) {
	    if (game.location.city !== undefined) $("#city").val(game.location.city);    
	    if (game.infos.surface !== undefined) $("#surface").val(game.infos.surface);
	    if (game.infos.tour !== undefined) $("#tour").val(game.infos.tour);
	    if (game.infos.court !== undefined) $("#court").val(game.infos.court);
    }
    if (game.infos.competition !== undefined) $("#competition").val(game.infos.competition);
    
    this.$el.i18n();
  },

  isTeamEditable: function (teamId) {
    var teamPlayer = this.game.get('teams')[teamId].players[0];
    return teamPlayer.id !== this.player.get('id') &&
           teamPlayer.owner !== undefined &&
           teamPlayer.owner === this.player.get('id');
  },

  onClose: function() {
    this.game.off("sync", this.render, this);
    if (this.useSearch===1)
      this.clubs.off("sync", this.renderList,this);
      
    if (this.confirmTimeout) {
      window.clearTimeout(this.confirmTimeout);
      this.confirmTimeout = null;
    }  
  }
});