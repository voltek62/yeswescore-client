Y.Views.Game = Y.View.extend({
  el : "#content",
  
  displayViewScoreBoard : "#scoreBoard",
  // Flux des commentaires
  // FIXME: sort by priority
  countComment : "#countComment",
      
  events : {
    'click #facebook' : 'share',
    'click #setPlusSetButton' : 'setPlusSet',
    'click #setMinusSetButton' : 'setMinusSet',
    'click #setPointWinButton' : 'setPointWin',
    'click #setPointErrorButton' : 'setPointError',
    'click #statusButton' : 'statusGame',
    'click #followButton' : 'followGame',
    'click #cancelButton' : 'cancelGame',
    'click #optionButton' : 'optionGame',
    'click .undoAction'   : 'undoAction',        
    'click #team1_set1_div' : 'setTeam1Set1',
    'click #team1_set2_div' : 'setTeam1Set2',
    'click #team1_set3_div' : 'setTeam1Set3',
    'click #team2_set1_div' : 'setTeam2Set1',
    'click #team2_set2_div' : 'setTeam2Set2',
    'click #team2_set3_div' : 'setTeam2Set3',
    'click .button-comments': 'goToComment'    
  },

  pageName: "game",
  pageHash : "games/",
      
  lastScore: null,
  currentScore: null,
  statusScore: null,
  dateStart: null,

  shareTimeout: null,
  sharing: false,

  initialize : function() {
      
    this.pageHash += this.id;       
    //header
    //i18n t("game.title")
    Y.GUI.header.title("MATCH");
      	
	  // loading templates.
	  this.templates = {
	    game:  Y.Templates.get('game'),
	    scoreboard: Y.Templates.get('gameScoreBoard')
	  };
	          	
    /*
    this.gameViewTemplate = Y.Templates.get('game');
    this.gameViewScoreBoardTemplate = Y.Templates
        .get('gameScoreBoard');
    */
		
    this.lastScore = new Array();
		
    // loading owner
    this.Owner = Y.User.getPlayer();
    this.gameDeferred = $.Deferred();
    this.game = new GameModel({id : this.id});
		
    //loading followed
    var games_follow = Y.Conf.get("owner.games.followed");
    if (games_follow !== undefined)
    {
      if (games_follow.indexOf(this.id) === -1) {
        this.follow = 'false';
      }
      else
        this.follow = 'true';          
    }
    else
      this.follow = 'false';
          
   // we render immediatly
    this.render(); 
    this.game.on("sync",this.render,this);      // rendu complet (1 seule fois)   PERFS: il faudrait un render spécial.
    this.game.fetch();
        
        
    //On compte les commentaires
    //On affiche que si les scores sont là
    var that = this;
    $.when(
  	  this.gameDeferred
    ).done(function () {
	    that.streams = new StreamsCollection([], {gameid : that.id});
	    that.streams.once("sync",that.renderCountComment,that);
	    that.streams.fetch();
    });
        
    // FIXME: SI ONLINE     
    // FIXME : temps de rafrichissement selon batterie et selon forfait  
    var pollingOptions = { delay: Y.Conf.get("game.refresh") };
    this.poller = Backbone.Poller.get(this.game, pollingOptions)
    this.poller.start();  
    this.poller.on('sync', this.render, this);
  },

  shareError: function (err) {
    console.log('share error: ' + err);
    var that = this;
    this.$(".facebook").addClass("ko");
    this.shareTimeout = window.setTimeout(function () {
      that.$(".facebook").removeClass("ko");
      that.shareTimeout = null;
    }, 5000);
  },

  shareSuccess: function () {
    var that = this;
    this.$(".facebook").addClass("ok");
    this.shareTimeout = window.setTimeout(function () {
      that.$(".facebook").removeClass("ok");
      that.shareTimeout = null;
    }, 5000);
  },

  share: function () {
	  console.log('game: sharing on facebook');
    // semaphore
    if (this.sharing)
      return; // cannot click on button until previous sharing is finished.
    this.sharing = true;
    // reseting GUI.
    this.$(".faceboook").removeClass("ok");
    this.$(".faceboook").removeClass("ko");
    // clearing eventual timeouts
    if (this.shareTimeout) {
      window.clearTimeout(this.shareTimeout);
      this.shareTimeout = null;
    }
    // 
    var status = this.game.get("status");
    // cannot share canceled game
    if (status == "canceled") {
      return this.shareError("cannot share a canceled game");
    }
    // we build a message for facebook.
    // ex: [PlayersTeamA] [Versus] [PlayersTeamB]. [WinningPlayers] [scoreInfos] [score] [time]. [PROMO]
    var messages = { };
    // players names
    messages['[playersTeamA]'] = this.game.getPlayersNamesByTeam(0);
    messages['[playersTeamB]'] = this.game.getPlayersNamesByTeam(1);
    // versus text
    var versus;
    if (status == "created") {
      versus = "va bientôt jouer contre";
    } else if (status == "ongoing") {
      versus = "joue contre";
    } else if (status == "finished") {
      versus = "a joué contre";
    } else {
      versus = "VS"; // neutral
    }
    messages['[versus]'] = versus;

    var winningTeamIndex = this.game.getIndexWinningTeam();
    var winningPlayers, scoreInfos;
    // message : [Draw] [score] in [time]/[PlayerTeamA] wins [score] in [time]
    switch (winningTeamIndex) {
      case -1:
        winningPlayers = "";
        scoreInfos = "Egalité !";
        break;
      case 1:
        winningPlayers = this.game.getPlayersNamesByTeam(1);
        scoreInfos = (status == "finished") ? "a gagné":"mène le jeu.";
        break;
      case 0:
        winningPlayers = this.game.getPlayersNamesByTeam(0);
        scoreInfos = (status == "finished") ? "a gagné":"mène le jeu.";
        break;
      case null:
      default:
        winningPlayers = "";
        scoreInfos = "";
        break;
    }
    messages['[winningPlayers]'] = winningPlayers;
    messages['[scoreInfos]'] = scoreInfos;
    //
    messages['[score]'] = this.game.get('options').score;
    messages['[sets]'] = this.game.get('options').sets;

    // hÃ¢te toi de consulter 
    messages['[time]'] = ""; // FIXME: temps Ã©coulÃ©.

    // FIXME: message promo en conf
    // FIXME: url facebook doit pointer vers la game
    messages['[PROMO]'] = "\n"+'Retrouvez ces scores, ceux de votre club et de vos amis sur Android, iOS et WindowsPhone ou sur la page facebook YesWeScore';

    var messagePattern = "[playersTeamA] [versus] [playersTeamB]. [winningPlayers] [scoreInfos] [sets] [time] [PROMO]";
    var message = _.reduce(_.keys(messages), function (result, token) {
      console.log('result=' + result + ' token='+token + ' val='+messages[token]);
      return result.replace(new RegExp(token.toRegExp(), "g"), messages[token]);
    }, messagePattern);

    // building message
    console.log("SENDING FACEBOOK MESSAGE: " + message);
    var that = this;
    var id = String(this.id);
	  Y.Facebook.shareAsync(id, message, function (err) {
      that.sharing = false;
      if (err)
        return that.shareError(err);
      that.shareSuccess();
    });
  },
 
  updateOnEnter : function(e) {
    if (e.keyCode == 13) {
      console.log('touche entrÃ©e envoie le commentaire');
      this.commentSend();
    }
  },

  undoAction: function () {
    console.log('undo');
    	   	  
    if ( this.statusScore !== "finished"  ) {  
	    if (this.lastScore.length > 1) {
	      var sets_update = this.lastScore.pop();
	
	      //S'il s'agit du meme score
	      if (sets_update === this.currentScore ) {
		      sets_update = this.lastScore.pop();	    	  
		      console.log("second pop : ",sets_update);  
	      }
	    	  
	      var gameid = $('#gameid').val();   
	    	  	  
	      //console.log("Il reste : ",this.lastScore);  
	      if (sets_update !== 'undefined') {
		      var game = {
				    team1 : $('#team1').val()
			      , rank1 : $('#rank1').val()
			      , team1_id : $('#team1_id').val()
			      , team2 : $('#team2').val()
			      , rank2 : $('#rank2').val()
			      , team2_id : $('#team2_id').val()
			      , country : $('#country').val()	      
			      , city : $('#city').val()
			      , playerid : $('#playerid').val()
			      , token : $('#token').val()
			      , court : $('#court').val()
			      , surface : $('#surface').val()
			      , tour : $('#tour').val()
			      , subtype : $('#subtype').val()
			      , sets : sets_update
			      , id : gameid 
		      };
		        
	
		      this.game = new GameModel(game);	    
		      var that = this;
	
		      this.game.save({}, {
            success: function(model, response) {
			        that.lastScore.push(model.toJSON().options.sets);	    
			        that.currentScore = model.toJSON().options.sets;        
			        //console.log(that.lastScore);
	  				
		    	    $(that.displayViewScoreBoard).html(that.templates.scoreboard({
		            game : model.toJSON(),
		            Owner : that.Owner.toJSON()
		          }));
            }
          });   
	      } 
	    }
    }
  },
      
  goToComment: function (elmt) {
    var route = $(elmt.currentTarget).attr("data-js-href");
    Y.Router.navigate(route, {trigger: true}); 
  },

  setTeamSet : function(input, div) {
    if ($.isNumeric(input.val()))
      set = parseInt(input.val(), 10) + 1;
    else
      set = '1';
          
    if ( this.statusScore === "ongoing"  ) {
	    if (this.game.toJSON().owner === this.Owner.id ) {  
		    input.val(set);
		        
		    //FIXME : NO HTML IN CODE
		    div.html('<div class="score">'+set+'</div>');
		        
		    this.sendUpdater();
	    }
	  }
  },

  setTeam1Set1 : function() {
    console.log('setTeam1Set1');
    this.setTeamSet($('#team1_set1'), $('#team1_set1_div'));
  },

  setTeam1Set2 : function(options) {
    console.log('setTeam1Set2');        
    this.setTeamSet($('#team1_set2'), $('#team1_set2_div'));
  },

  setTeam1Set3 : function() {
    console.log('setTeam1Set3');
    this.setTeamSet($('#team1_set3'), $('#team1_set3_div'));
  },

  setTeam2Set1 : function() {
    this.setTeamSet($('#team2_set1'), $('#team2_set1_div'));
  },

  setTeam2Set2 : function() {
    this.setTeamSet($('#team2_set2'), $('#team2_set2_div'));
  },

  setTeam2Set3 : function() {
    this.setTeamSet($('#team2_set3'), $('#team2_set3_div'));
  },

  submitAttachment : function(data) {
    return false;
  },

  sendUpdater : function() {
    var gameid = $('#gameid').val()
    , team1_set1 = $('#team1_set1').val()
    , team1_set2 = $('#team1_set2').val()
    , team1_set3 = $('#team1_set3').val()
    , team2_set1 = $('#team2_set1').val()
    , team2_set2 = $('#team2_set2').val()
    , team2_set3 = $('#team2_set3').val()                                
    , tennis_update = null;

    if ($.isNumeric(team1_set1) === false)
      team1_set1 = '0';
    if ($.isNumeric(team2_set1) === false)
      team2_set1 = '0';

    var sets_update = team1_set1 + '/' + team2_set1;

    if (team1_set2 > 0 || team2_set2 > 0) {
      if ($.isNumeric(team1_set2) === false)
        team1_set2 = '0';
      if ($.isNumeric(team2_set2) === false)
        team2_set2 = '0';

      sets_update += ";" + team1_set2 + '/' + team2_set2;
    }
    if (team1_set3 > 0 || team2_set3 > 0) {

      if ($.isNumeric(team1_set3) === false)
        team1_set3 = '0';
      if ($.isNumeric(team2_set3) === false)
        team2_set3 = '0';

      sets_update += ";" + team1_set3 + '/' + team2_set3;
    }

    // FIXME : On remplace les espaces par des zeros
    // sets_update = sets_update.replace(/ /g,'0');

    console.log('sets_update',sets_update);
    this.currentScore = sets_update;
        
    //on incremente le tableau
    this.lastScore.push(sets_update);
    console.log('lastScore ',this.lastScore);
        
        
        
    var game = {
		  team1 : $('#team1').val()
	    , rank1 : $('#rank1').val()
	    , team1_id : $('#team1_id').val()
	    , team2 : $('#team2').val()
	    , rank2 : $('#rank2').val()
	    , team2_id : $('#team2_id').val()
	    , country : $('#country').val()	      
	    , city : $('#city').val()
	    , playerid : $('#playerid').val()
	    , token : $('#token').val()
	    , court : $('#court').val()
	    , surface : $('#surface').val()
	    , tour : $('#tour').val()
	    , subtype : $('#subtype').val()
	    , sets : sets_update
	    , id : gameid 
    };
    this.game = new GameModel(game);
    this.game.save({}, {success: function(model, response){ }}); 
  },

  setPlusSet : function() {
	  var selected = $('input[name=team_selected]:checked').val();
	  var set = parseInt($('#team' + selected + '_set1').val(), 10) + 1;
	  // console.log(set);
	
	  // FIXME : Regle de Gestion selon le score
	
	  $('#team' + selected + '_set1').val(set);
	  $('#team' + selected + '_set1_div').html(set);
	
	  this.sendUpdater();
  },

  setMinusSet : function() {
	  var selected = $('input[name=team_selected]:checked').val();
	  var set = parseInt($('#team' + selected + '_set1').val(), 10) - 1;
	  console.log(set);
	
	  if (set < 0)
	    set = 0;
	  // FIXME : Regle de Gestion selon le score
	
	  $('#team' + selected + '_set1').val(set);
	  $('#team' + selected + '_set1_div').html(set);
	
	  this.sendUpdater();
  },

  setPoint : function(mode) {
    // 15 30 40 AV
    var selected = $('input[name=team_selected]:checked').val(), selected_opponent = '';

    // le serveur gagne un point
    if (mode == true) {
      if (selected == '2') {
        selected_opponent = '2';
      } else
        selected_opponent = '1';
    }
    // le serveur perd un point
    else {
      if (selected == '2') {
        selected = '1';
        selected_opponent = '2';
      } else
        selected = '2';
      selected_opponent = '1';
    }

    var set_current = $('input[name=set_current]:checked').val(), point = $(
        '#team' + selected + '_points').val(), point_opponent = $(
        '#team' + selected_opponent + '_points').val();

    // Le serveur gagne son set
    if (point == 'AV'
        || (point == '40' && (point_opponent != '40' || point_opponent != 'AV'))) {
      // On ajoute 1 set au gagnant les point repartent Ã  zero
      var set = parseInt(
          $('#team' + selected + '_set' + set_current).val(), 10) + 1;
      $('#team' + selected + '_set1').val(set);
      $('#team' + selected + '_set1_div').html(set);

      point = '00';
      $('#team1_points').val(point);
      $('#team1_points_div').html(point);
      $('#team2_points').val(point);
      $('#team2_points_div').html(point);
    } else {
      if (point === '00')
        point = '15';
      else if (point === '15')
        point = '30';
      else if (point === '30')
        point = '40';
      else if (point === '40')
        point = 'AV';
      else if (point === 'AV')
        point = '00';
      else {
        point = '00';
        // On met l'adversaire Ã  zÃ©ro
        $('#team' + selected_opponent + '_points').val(point);
        $('#team' + selected_opponent + '_points_div').html(point);
      }

      $('#team' + selected + '_points').val(point);
      $('#team' + selected + '_points_div').html(point);
    }
    this.sendUpdater();
  },

  setPointWin : function() {
    console.log('setPointWin');
    this.setPoint(true);
  },

  setPointError : function() {
    console.log('setPointError');
    this.setPoint(false);
  },
      

  // renderRefresh : refresh only scoreboard
  renderRefresh : function() {
    console.log('renderRefresh avec '+this.game.toJSON().options.sets);
        
    $(this.displayViewScoreBoard).html(this.templates.game({
      game : this.game.toJSON(),
      Owner : this.Owner.toJSON(),
      follow : this.follow
    }));
     
    return false;
  },
  
  renderCountComment : function() {
	  var nbComments = this.streams.length;
      
    //console.log('nbComments',nbComments);
      
    if (nbComments > 10)
      this.$(".link-comments").html("10 DERNIERS COMMENTAIRES");
    else if (nbComments == 1)
      this.$(".link-comments").html("1 COMMENTAIRE");
    else if (nbComments > 0)
      this.$(".link-comments").html(nbComments + " COMMENTAIRES");
    else
      this.$(".link-comments").html("0 COMMENTAIRE");
  },

  refreshTimer : function() {
    var dateEnd = new Date();
    var dateStart = new Date(this.dateStart);
          	
    timer = dateEnd - dateStart;
          
    if (timer>0)
    {
	    console.log('timer refreshTimer',timer);
	          
	    var dateTimer = new Date(0, 0, 0, 0, 0, 0, timer);         
	    timer = ('0'+dateTimer.getHours()).slice(-2)+':'+('0'+dateTimer.getMinutes()).slice(-2);       
	    $('.timer').html(timer); 
    }      
  },		

  render : function() {
    //si premiere init et lastScore null, on stock le score en cours
    if (this.lastScore.length === 0) {
	    if (this.game.toJSON().owner !== "") {	          
	      //console.log('sets ',this.game.toJSON().options.sets);	        
	      if (this.game.toJSON().options.sets !== undefined) {
	          
	        this.statusScore = this.game.toJSON().status;      
		    console.log('statusScore',this.statusScore);
	          
	        if (this.game.toJSON().options.sets!=="") {
		        this.lastScore.push(this.game.toJSON().options.sets);	    
		        this.currentScore = this.game.toJSON().options.sets;  
	        }
	      }
	          
	      this.gameDeferred.resolve(); 
	    }
    }
        
    var timer = '';
        
    if ( this.game.toJSON().status === "finished" ) {
       
      var dateEnd = new Date(this.game.toJSON().dates.end);
      var dateStart = new Date(this.game.toJSON().dates.start);
          	
      timer = dateEnd - dateStart;
      var dateTimer = new Date(0, 0, 0, 0, 0, 0, timer);         
      timer = ('0'+dateTimer.getHours()).slice(-2)+':'+('0'+dateTimer.getMinutes()).slice(-2);        
        
    }
    else if ( this.game.toJSON().status === "ongoing" ) {
        
      //comment connaitre la date actuelle par rapport au serveur ?
      var dateEnd = new Date();
      var dateStart = new Date(this.game.toJSON().dates.start);
      this.dateStart = this.game.toJSON().dates.start;
          	
      timer = dateEnd - dateStart;
          
      if (timer>0)
      {
	      console.log('timer ongoing',timer);
	          
	      var dateTimer = new Date(0, 0, 0, 0, 0, 0, timer);         
	      timer = ('0'+dateTimer.getHours()).slice(-2)+':'+('0'+dateTimer.getMinutes()).slice(-2);        
      }
      //declenche setTimeout(); qui met à jour toutes les 50 secondes ???
      //setInterval ( this.refreshTimer, 1000 );
          
    }
                
    // FIXME: refresh only input and id
    this.$el.html(this.templates.game({
      game : this.game.toJSON(),
      Owner : this.Owner.toJSON(),
      timer : timer,
      follow : this.follow
    }));

    /* css transition: performance issues: disabled
    var $buttonCommentaires = this.$(".button-commentaires");
    setTimeout(function () {
      $buttonCommentaires.css("height", "87px");
    }, 100);
    */
        
		
    $(this.displayViewScoreBoard).html(this.templates.scoreboard({
      game : this.game.toJSON(),
      Owner : this.Owner.toJSON()
    }));
		

    //i18n
    //PERF:on remplace que les champs du DOM concerné
    $('#statusButton').i18n();

    return this;
  },

  alertDismissed : function() {
    // do something
  },
      

  statusGame : function() {    
    var gameid = $('#gameid').val();
    console.log('statusGame '+gameid+'  status '+this.statusScore);

    var game = {
	    team1 : $('#team1').val()
	    , rank1 : $('#rank1').val()
	    , team1_id : $('#team1_id').val()
	    , team2 : $('#team2').val()
	    , rank2 : $('#rank2').val()
	    , team2_id : $('#team2_id').val()	      
	    , playerid : $('#playerid').val()
	    , token : $('#token').val()
	    , id : gameid 
    };
    	

    if ( this.statusScore === "created"  ) {
      game.status = "ongoing";    	          
      var tennis_update = new GameModel(game);
      var that = this;
	    tennis_update.save({}, {
        success: function(model, response){
	        console.log('success ');
          $("#statusButton").html('Terminer match');
          that.statusScore = "ongoing";	      
        }
	    });
    }
    else if ( this.statusScore === "ongoing"  ) {
      game.status = "finished";    	          
      var tennis_update = new GameModel(game);
      var that = this;
	    tennis_update.save({}, {
        success: function(model, response){
	        console.log('success ');	        
            $("#statusButton").html('Match Fini');
            that.statusScore = "finished"; 	  
          }
	    });
    }   
  },      

      
  optionGame : function() {

    Y.Router.navigate("/games/form/"+this.id,{trigger:true})
  },      

  followGame : function() {

    if (this.follow === 'true') {

      var games_follow = Y.Conf.get("owner.games.followed");
      if (games_follow !== undefined)
      {
        if (games_follow.indexOf(this.id) !== -1) {
          //On retire l'elmt
          games_follow.splice(games_follow.indexOf(this.id), 1);
          Y.Conf.set("owner.games.followed", games_follow, { permanent: true });
        }
      }
          
      $('span.success').html('Vous ne suivez plus ce match').show();
      $("#followButton").text("Suivre");

      this.follow = 'false';

    } else {
        
      //Via localStorage
      var games_follow = Y.Conf.get("owner.games.followed");
      if (games_follow !== undefined)
      {
        if (games_follow.indexOf(this.id) === -1) {
          games_follow.push(this.id);
          Y.Conf.set("owner.games.followed", games_follow, { permanent: true });
        }
      }
      else
        Y.Conf.set("owner.games.followed", [this.id]);

      $('span.success').html('Vous suivez ce joueur').show();

      $("#followButton").text("Ne plus suivre");

      this.follow = 'true';

    }

  },

  cancelGame : function() {

    console.log('On retire la derniere action');

  },

  onClose : function() {
    // Clean
    this.undelegateEvents();
    this.game.off("sync",this.render,this);
    this.streams.off("sync",this.renderCountComment,this);
        
    if (this.shareTimeout) {
      window.clearTimeout(this.shareTimeout);
      this.shareTimeout = null;
    }

    // FIXME:remettre
    this.poller.stop();
    this.poller.off('sync', this.render, this);
  }
});