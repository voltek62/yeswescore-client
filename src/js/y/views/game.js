Y.Views.Game = Y.View.extend({
  el : "#content",
  
  displayViewScoreBoard : "#scoreBoard",
  // Flux des commentaires
  // FIXME: sort by priority
  countComment : "#countComment",
      
  events : {
    'click #facebook' : 'share',
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
  
  team1_set1 : '&nbsp;'
  , team1_set2 : '&nbsp;'
  , team1_set3 : '&nbsp;'
  , team2_set1 : '&nbsp;'
  , team2_set2 : '&nbsp;'
  , team2_set3 : '&nbsp;'
  , team1_sets : '0'
  , team2_sets : '0'
  , playerid : null
  , gameid : null
  , token : null
  
  /*
  , team1 : null
  , rank1 : null
  , team1_id : null
  , team2 : null
  , rank2 : null
  , team2_id : null
  , country : null	      
  , city : null
  , playerid : null
  , token : null
  , court : null
  , surface : null
  , tour : null
  , subtype : null*/

  ,initialize : function() {
      
    this.pageHash += this.id;       
    //header
    //i18n t("game.title")
    Y.GUI.header.title(i18n.t('game.title'));
      	
	  // loading templates.
	  this.templates = {
	    game:  Y.Templates.get('game'),
	    scoreboard: Y.Templates.get('gameScoreBoard')
	  };
	          	
	//On stock les dernieres modifs		
    this.lastScore = new Array();
		
    // loading owner
    this.owner = Y.User.getPlayer();
    this.token = this.owner.get('token');
    this.playerid = this.owner.get('id');    
    
    this.gameDeferred = $.Deferred();
    this.game = new GameModel({id : this.id});
    this.gameid = this.id;
		
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
      versus = i18n.t('game.fbversus1');
    } else if (status == "ongoing") {
      versus = i18n.t('game.fbversus2');
    } else if (status == "finished") {
      versus = i18n.t('game.fbversus3');
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
        scoreInfos = i18n.t('game.fbegality')+" !";
        break;
      case 1:
        winningPlayers = this.game.getPlayersNamesByTeam(1);
        scoreInfos = (status == "finished") ? i18n.t('game.fbstatus1'):i18n.t('game.fbstatus2');
        break;
      case 0:
        winningPlayers = this.game.getPlayersNamesByTeam(0);
        scoreInfos = (status == "finished") ? i18n.t('game.fbstatus1'):i18n.t('game.fbstatus2');
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

    // hate toi de consulter 
    messages['[time]'] = ""; // FIXME: temps �coul�

    // FIXME: message promo en conf
    // FIXME: url facebook doit pointer vers la game
    messages['[PROMO]'] = "\n"+i18n.t('game.fbpromo');

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
	    	  
	      var gameid = this.gameid;   
	    	  	  
	      //console.log("Il reste : ",this.lastScore);  
	      if (sets_update !== 'undefined') {
		      var game = {
				    team1_id : this.game.get('teams')[0].players[0].id
			      , team2_id : this.game.get('teams')[1].players[0].id
			      , id : this.gameid 			      
			      , playerid : this.playerid
			      , token : this.token			      			      			      
			      , country : this.game.get('location').country	      
			      , city : this.game.get('location').city
			      , court : this.game.get('options').court
			      , surface : this.game.get('options').surface
			      , tour : this.game.get('options').tour
			      , subtype : this.game.get('options').subtype			      
			      , sets : sets_update

		      };
		        
	
		      this.game = new GameModel(game);	    
		      var that = this;
	
		      this.game.save({}, {
            success: function(model, response) {
			        //that.lastScore.push(model.toJSON().options.sets);	    
			        //that.currentScore = model.toJSON().options.sets;  
			        that.lastScore.push(model.get('options.sets'));	    
			        that.currentScore = model.get('options.sets');  			              
			        console.log(that.lastScore);
	  				
	  				that.game = model;
	  				
		    	    $(that.displayViewScoreBoard).html(that.templates.scoreboard({
		            game : model.toJSON(),
		            //owner : that.owner.toJSON()
		            owner : model.get('owner')
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
  
     var set = '';	
        
    if ($.isNumeric(input))
      set = parseInt(input, 10) + 1;
    else
      set = '1';          	
    
    if ( this.statusScore === "ongoing"  ) {
	    if (this.game.get('owner') === this.playerid ) {  
		    //input.val(set);
		    
			if (div.attr('id').indexOf('team1_set1')!=-1)
		     this.team1_set1 = set;
		    else if (div.attr('id').indexOf('team1_set2')!=-1)
		     this.team1_set2 = set;
		    else if (div.attr('id').indexOf('team1_set3')!=-1)
		     this.team1_set3 = set;
		    else if (div.attr('id').indexOf('team2_set1')!=-1)
		     this.team2_set1 = set;
		    else if (div.attr('id').indexOf('team2_set2')!=-1)
		     this.team2_set2 = set;
		    else if (div.attr('id').indexOf('team2_set3')!=-1)
		     this.team2_set3 = set;
		     		     		     		     		        
		    //FIXME : NO HTML IN CODE
		    div.html('<div class="score">'+set+'</div>');
		        
		    this.sendUpdater();
	    }
	  }
	  
  },

  setTeam1Set1 : function() {
    this.setTeamSet(this.team1_set1, $('#team1_set1_div'));
  },

  setTeam1Set2 : function(options) {
    this.setTeamSet(this.team1_set2, $('#team1_set2_div'));
  },

  setTeam1Set3 : function() {
    this.setTeamSet(this.team1_set3, $('#team1_set3_div'));
  },

  setTeam2Set1 : function() {  
    this.setTeamSet(this.team2_set1, $('#team2_set1_div'));
  },

  setTeam2Set2 : function() { 
    this.setTeamSet(this.team2_set2, $('#team2_set2_div'));
  },

  setTeam2Set3 : function() { 
    this.setTeamSet(this.team2_set3, $('#team2_set3_div'));
  },



  sendUpdater : function() {
    var gameid = this.gameid
    , team1_set1 = this.team1_set1
    , team1_set2 = this.team1_set2
    , team1_set3 = this.team1_set3
    , team2_set1 = this.team2_set1
    , team2_set2 = this.team2_set2
    , team2_set3 = this.team2_set3                                
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


    console.log('sets_update',sets_update);
    this.currentScore = sets_update;
        
    //on incremente le tableau
    this.lastScore.push(sets_update);
    console.log('lastScore ',this.lastScore);
        
        
      var game = {
		    team1_id : this.game.get('teams')[0].players[0].id
	      , team2_id : this.game.get('teams')[1].players[0].id
	      , id : this.gameid 			      
	      , playerid : this.playerid
	      , token : this.token			      			      			      
	      , country : this.game.get('location').country	      
	      , city : this.game.get('location').city
	      , court : this.game.get('options').court
	      , surface : this.game.get('options').surface
	      , tour : this.game.get('options').tour
	      , subtype : this.game.get('options').subtype			      
	      , sets : sets_update
      };
     
    var that = this;
      
    this.game = new GameModel(game);
    this.game.save({}, {success: function(model, response){ 
      that.game = model;
    }}); 
  },


      

  // renderRefresh : refresh only scoreboard
  renderRefresh : function() {
     
    $(this.displayViewScoreBoard).html(this.templates.game({
      game : this.game.toJSON(),
      owner : this.owner.toJSON(),
      follow : this.follow
    }));
     
    return false;
  },
  
  renderCountComment : function() {
	  var nbComments = this.streams.length;
      
    if (nbComments > 10)
      this.$(".link-comments").html(i18n.t('game.10lastcomments'));
    else if (nbComments == 1)
      this.$(".link-comments").html(i18n.t('game.1comment'));
    else if (nbComments > 0)
      this.$(".link-comments").html(nbComments + " "+i18n.t('game.comments'));
    else
      this.$(".link-comments").html(i18n.t('game.0comment'));
  },

  refreshTimer : function() {
    var dateEnd = new Date();
    var dateStart = new Date(this.dateStart);
          	
    timer = dateEnd - dateStart;
          
    if (timer>0)
    {     
	    var dateTimer = new Date(0, 0, 0, 0, 0, 0, timer);         
	    timer = ('0'+dateTimer.getHours()).slice(-2)+':'+('0'+dateTimer.getMinutes()).slice(-2);       
	    $('.timer').html(timer); 
    }      
  },		

  render : function() {

    var game = this.game;
    
    console.log('render game',game);

    //si premiere init et lastScore null, on stock le score en cours
    if (this.lastScore.length === 0) {
	    if (game.get('owner') !== "") {	          
	      //console.log('sets ',game.options.sets);	        
	      if (game.get('options').sets !== undefined) {
	          
	        this.statusScore = game.get('status');      

	          
	        if (game.get('options').sets!=="") {
		        this.lastScore.push(game.get('options').sets);	    
		        this.currentScore = game.get('options').sets;  
	        }
	      }
	      
	      this.gameid = game.id;

	      
	      /*
	      this.team1_id=game.teams[0].players[0].id;
	      this.team2_id=game.teams[1].players[0].id; 
		  this.country = game.location.country;  
	      this.city = game.loation.city;
	      this.court = game.options.court;
	      this.surface = game.options.surface;
	      this.tour : game.options.tour;
	      this.subtype : game.options.subtype;
	      this.sets : game.options.sets;
		  */
    
	      this.gameDeferred.resolve(); 
	    }
    }
        
    var timer = '';
        
    if ( game.get('status') === "finished" ) {
       
      var dateEnd = new Date(game.get('dates').end);
      var dateStart = new Date(game.get('dates').start);
          	
      timer = dateEnd - dateStart;
      var dateTimer = new Date(0, 0, 0, 0, 0, 0, timer);         
      timer = ('0'+dateTimer.getHours()).slice(-2)+':'+('0'+dateTimer.getMinutes()).slice(-2);        
        
    }
    else if ( game.get('status') === "ongoing" ) {
        
      //comment connaitre la date actuelle par rapport au serveur ?
      var dateEnd = new Date();
      var dateStart = new Date(game.get('dates').start);
      //this.dateStart = game.dates.start;
       	
      timer = dateEnd - dateStart;
      
      console.log('timer',timer);
          
      if (timer>0)
      {
	      //console.log('timer ongoing',timer);
	          
	      var dateTimer = new Date(0, 0, 0, 0, 0, 0, timer);         
	      timer = ('0'+dateTimer.getHours()).slice(-2)+':'+('0'+dateTimer.getMinutes()).slice(-2);        
      }
      //declenche setTimeout(); qui met à jour toutes les 50 secondes ???
      //setInterval ( this.refreshTimer, 1000 );
          
    }
                
    // FIXME: refresh only input and id
    
    this.$el.html(this.templates.game({
      game : game.toJSON(),
      timer : timer,
      playerid : this.playerid,      
      follow : this.follow
    }));


    /* css transition: performance issues: disabled
    var $buttonCommentaires = this.$(".button-commentaires");
    setTimeout(function () {
      $buttonCommentaires.css("height", "87px");
    }, 100);
    */
    
	  if (game.get('options').score !== null ) { 
	    if(game.get('options').score.indexOf('/')!=-1) { 
	      var scoreboard = game.get('options').score.split('/'); 
	      this.team1_sets = scoreboard[0]; 
	      this.team2_sets = scoreboard[1]; 
	      } 
	  } 
	  
	  if (game.get('options').sets !== null ) { 
	    if (game.get('options').sets.indexOf(';')!=-1) { 
	      var scoreboard = game.get('options').sets.split(';'); 
	    
	      if (scoreboard.length==2 ||scoreboard.length==3) { 
	        var scoreboard1 = scoreboard[0].split('/');
	        this.team1_set1 = scoreboard1[0]; 
	        this.team2_set1 = scoreboard1[1]; 
	        var scoreboard2 = scoreboard[1].split('/'); 
	        this.team1_set2 = scoreboard2[0]; 
	        this.team2_set2 = scoreboard2[1]; 
	        this.set_current=2; 
	      } 
	    
	      if (scoreboard.length==3) { 
	        var scoreboard3 = scoreboard[2].split('/'); 
	        this.team1_set3 = scoreboard3[0]; 
	        this.team2_set3 = scoreboard3[1]; 
	        this.set_current=3; 
	      } 
	    } 
	    // 1 set 
	    else { 
	      if (game.get('options').sets.indexOf('/')!=-1) { 
	        var scoreboard1 = game.get('options').sets.split('/'); 
	        this.team1_set1 = scoreboard1[0]; 
	        this.team2_set1 = scoreboard1[1]; 
	      } 
	    } 
	  }        
	
	
    $(this.displayViewScoreBoard).html(this.templates.scoreboard({
      game : game.toJSON(),
  	  team1_set1 : this.team1_set1
  	  , team1_set2 : this.team1_set2
      , team1_set3 : this.team1_set3
      , team2_set1 : this.team2_set1
      , team2_set2 : this.team2_set2
      , team2_set3 : this.team2_set3
      , team1_sets : this.team1_sets
      , team2_sets : this.team2_sets      
    }));
		

    //i18n
    //PERF:on remplace que les champs du DOM concern�
    $('a').i18n();
    $('span').i18n();    
    //this.$el.i18n();

    return this;
  },

    

  statusGame : function() {    

    console.log('statusGame '+this.gameid+'  status '+this.statusScore);

    var game = {
	    team1_id : this.game.get('teams')[0].players[0].id
	    , team2_id : this.game.get('teams')[1].players[0].id	      
	    , playerid : this.playerid
	    , token : this.token
	    , id : this.gameid 
    };
    	
    console.log('game',game);

    if ( this.statusScore === "created"  ) {
      game.status = "ongoing";    	          
      var tennis_update = new GameModel(game);
      var that = this;
	    tennis_update.save({}, {
        success: function(model, response){
	        console.log('success ');
          $("#statusButton").html(i18n.t('game.finish'));
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
            $("#statusButton").html(i18n.t('game.finished'));
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
          
      //$('span.success').html('Vous ne suivez plus ce match').show();
      
      $("#followButton").text(i18n.t('message.follow'));

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

      //$('span.success').html('Vous suivez ce match').show();

      $("#followButton").text(i18n.t('message.nofollow'));

      this.follow = 'true';

    }

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