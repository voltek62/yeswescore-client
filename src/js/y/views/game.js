Y.Views.Game = Y.View.extend({
  el : "#content",
  
  displayViewScoreBoard : "#scoreBoard",
  // Flux des commentaires
  // FIXME: sort by priority
  countComment : "#countComment",
      
  events : {
    'click #facebook'       : 'share',
    'click .player-info'    : 'goToPlayerProfile',    
    'click .playerInfos'    : 'goToPlayerProfile',   
    'click #statusButton'   : 'statusGame',
    'click #statusRestart'  : 'restartGame',
    'click #followButton'   : 'followGame',
    'click #startTeam1'     : 'startTeam1',
    'click #startTeam2'     : 'startTeam2',        
    'click #cancelButton'   : 'cancelGame',
    'click #optionButton'   : 'goToOptions',
    'click .undoSelect'     : 'undoAction',    
    'click #team1_sets_div' : 'setTeam1Score',
    'click #team2_sets_div' : 'setTeam2Score',          
    'click .set'            : 'incrementTeamSet',
    'click .button-comments': 'goToComment'    
  },

  pageName: "game",
  pageHash : "games/",

  shareTimeout: null,
  infoTimeout: null,  
  sharing: false,

  gameid : null,

  initialize : function() {
    this.pageHash += this.id;
    this.gameid = this.id;

    //header
    Y.GUI.header.title(i18n.t('game.title'));
      	
	  // loading templates.
	  this.templates = {
	    game: Y.Templates.get('game'),
	    scoreboard: Y.Templates.get('gameScoreBoard')
	  };
	          	
	  // On stock les dernieres modifs
    this.DB = new Y.DB("Y.Games."+this.gameid+".");
		
    // loading owner
    this.player = Y.User.getPlayer();   
    
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

    // creating object game & stream (required by render)
    this.game = new GameModel({id : this.gameid});
    this.streams = new StreamsCollection([], {gameid : this.gameid});
       
    // Rendering.
    // first: we render immediatly
    this.render();
    // 
    this.game.once('sync', this.onGameInit, this);
    // rerender on game update
    this.game.on('sync', this.onGameSynched, this);
    // Fetching data the fist time
    this.game.fetch();

    //
    this.streams.once("sync", this.renderCountComment, this);
    this.streams.fetch();
  },

  onGameInit: function () {
    // Pooling du model game & affichage.
    // FIXME: SI ONLINE
    // FIXME : temps de rafrichissement selon batterie et selon forfait  
    if (!this.game.isMine()) {
      // mode lecture.
      var pollingOptions = { delay: Y.Conf.get("game.refresh"), delayed: true };
      this.poller = Backbone.Poller.get(this.game, pollingOptions)
      this.poller.start();
    } else {
      // mode edition: no pooling
    }
  },

  onGameSynched: function (model, resp, options) {
    if (this.game.version == options.version) {
      this.render();
    }
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
    messages['[score]'] = this.game.get('infos').score;
    messages['[sets]'] = this.game.get('infos').sets;

    // hate toi de consulter 
    messages['[time]'] = ""; // FIXME: temps écoulé

    // FIXME: message promo en conf
    // FIXME: url facebook doit pointer vers la game
    messages['[PROMO]'] = "\n\n"+i18n.t('game.fbpromo');

    var messagePattern = "[playersTeamA] [versus] [playersTeamB]. [winningPlayers] [scoreInfos] [sets] [time] [PROMO]";
    var message = _.reduce(_.keys(messages), function (result, token) {
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
  
  undoAction: function() {
    // mode lecture ou game finie => rien
    if (!this.game.isMine() || this.game.get('status') === "finished")
      return;
    // il n'est plus possible d'undo => rien
    var lastInfos = this.DB.readJSON("sets");
    if (lastInfos === undefined || lastInfos.length <= 1)
      return;
    // pop du dernier score
    var lastInfo = lastInfos.pop();
    this.DB.saveJSON("sets", lastInfos);
    // FIXME: good backbone way of saving attributes ???
    this.game.get('infos').sets = lastInfo[0];
    this.game.get('infos').score = lastInfo[1];
    //
    this.renderAndSave();
  },

  incrementTeamSet : function(ev) {
    if (!this.game.isMine())
      return;

    if (this.game.get('status') === "created") {
      this.$(".status").addClass("ko"); // on highlight le bouton
      return;
    }

    // on modifie le score du set en question dans l'objet game.
    var sets = this.game.getSets();
    var sets_tmp = this.game.getSets(0);
    var score = this.game.getScore();
    var set = $(ev.currentTarget).data('set');
    var team = $(ev.currentTarget).data('team');

    /* regle de gestion */
    // add diff de 2 max si superieur à 6
    // add force score if diff de 2 ou on peut mettre à jour les scores ? on controle si 0,1,2,3
    var team1_set = sets_tmp[set][0];
    var team2_set = sets_tmp[set][1];
    var total_sets = parseInt(team1_set, 10) + parseInt(team2_set, 10);

    // incrementation
	  sets = this.game.getSets();
	  if (typeof sets[set] === "undefined")
	    sets[set] = [ 0, 0 ];
	  sets[set][team]++;
    sets_tmp[set][team]++;

    // limitation
    var diff_sets1 = Math.abs(parseInt(sets_tmp[0][0], 10)-parseInt(sets_tmp[0][1], 10));
    var diff_sets2 = Math.abs(parseInt(sets_tmp[1][0], 10)-parseInt(sets_tmp[1][1], 10));
    var diff_sets3 = Math.abs(parseInt(sets_tmp[2][0], 10)-parseInt(sets_tmp[2][1], 10));

    if ((sets_tmp[0][0]>=7 && diff_sets1>2) ||
        (sets_tmp[0][1]>=7 && diff_sets1>2) ||
        (sets_tmp[1][0]>=7 && diff_sets2>2) ||
        (sets_tmp[1][1]>=7 && diff_sets2>2) ||
        (sets_tmp[2][0]>=7 && diff_sets3>2) ||
        (sets_tmp[2][1]>=7 && diff_sets3>2)) {
      // incrementation impossible
      return;
    }
    
    // MAJ cache
    var setsCache = this.DB.readJSON("sets");
    var newData = [this.game.get('infos').sets, this.game.get('infos').score];
    if (setsCache === undefined) {
      setsCache = [[0, 0], newData];
    } else {
      setsCache.push(newData);
    }
    this.DB.saveJSON("sets", setsCache);

    // update en DB
    this.game.setSets(sets);
    //
    this.renderAndSave();
  },
  
  renderCountComment : function() {
	  var nbComments = this.streams.length;

    if (nbComments > Y.Conf.get("game.max.comments") )
      this.$(".link-comments").html(i18n.t('game.50lastcomments'));
    else if (nbComments == 1)
      this.$(".link-comments").html(i18n.t('game.1comment'));
    else if (nbComments > 0)
      this.$(".link-comments").html(nbComments + " "+i18n.t('game.comments'));
    else
      this.$(".link-comments").html(i18n.t('game.0comment'));
  },	

  render : function() {
    if (this.game.isFinished()) {
      $("#statusButton").html(i18n.t('game.gamefinished'));	         
      $("#optionButton").attr('id', 'statusRestart');
 	    $("#statusRestart").html(i18n.t('game.restart'));
    }
    
    // FIXME: refresh only input and id
    this.$el.html(this.templates.game({
      game : this.game.toJSON(),
      timer : this.game.getElapsedTime(),
      playerid : this.player.get('id'),      
      follow : this.follow
    }));
    
    this.renderScoreBoard(this.game);
    if (this.streams)
      this.renderCountComment();
	
	  if (this.game.get('infos').startTeam === undefined) {
	    $('.button-comments').css('display', 'none');
    }

    //i18n
    //PERF:on remplace que les champs du DOM concernés
    $('a').i18n();
    $('span').i18n();

    return this;
  },

  renderScoreBoard : function(game) {
    var sets = game.getSets('&nbsp')
      , score = game.getScore();
    
    //
    $(this.displayViewScoreBoard).html(this.templates.scoreboard({
        game : game.toJSON()
  	  , team1_set1 : sets[0][0]
  	  , team1_set2 : sets[1][0]
      , team1_set3 : sets[2][0]
      , team2_set1 : sets[0][1]
      , team2_set2 : sets[1][1]
      , team2_set3 : sets[2][1]
      , team1_sets : String(score[0]) || '&nbsp'
      , team2_sets : String(score[1]) || '&nbsp'
    }));
		
    //i18n
    //PERF:on remplace que les champs du DOM concernés
    $('a').i18n();
    $('span').i18n();
    
	  var total_sets = parseInt(score[0]) + parseInt(score[1]);
    if (total_sets >= 2)  {
      $('#team1_set1_div .score').removeClass('ongoing');
      $('#team2_set1_div .score').removeClass('ongoing');
      $('#team1_set2_div .score').removeClass('ongoing');
      $('#team2_set2_div .score').removeClass('ongoing');
      $('#team3_set3_div .score').addClass('ongoing');
      $('#team3_set3_div .score').addClass('ongoing');
    }             
    else if (total_sets === 1)  {
      $('#team1_set1_div .score').removeClass('ongoing');
      $('#team2_set1_div .score').removeClass('ongoing');
      $('#team1_set2_div .score').addClass('ongoing');
      $('#team2_set2_div .score').addClass('ongoing');
      $('#team3_set3_div .score').removeClass('ongoing');
      $('#team3_set3_div .score').removeClass('ongoing');
    }
    else {
      $('#team1_set1_div .score').addClass('ongoing');
      $('#team2_set1_div .score').addClass('ongoing');
      $('#team1_set2_div .score').removeClass('ongoing');
      $('#team2_set2_div .score').removeClass('ongoing');
      $('#team3_set3_div .score').removeClass('ongoing');
      $('#team3_set3_div .score').removeClass('ongoing');
    }

	  var startTeam = game.get('infos').startTeam;
	  if (game.whoServe() === startTeam) {
	    if (game.get('teams')[0].id === startTeam) {
		    $('.server1').addClass('server-ball');
		    $('.server2').removeClass('server-ball');
	    } else {
		    $('.server1').removeClass('server-ball');
		    $('.server2').addClass('server-ball');	  
	    }
	  } else {
	    if (game.get('teams')[0].id === startTeam) {
		    $('.server1').removeClass('server-ball');
		    $('.server2').addClass('server-ball');
	    } else {
		    $('.server1').addClass('server-ball');
		    $('.server2').removeClass('server-ball');
	    }
	  }
    return this;
  },

  // fixme: on risque de passer de closed => ongoing ?
  restartGame : function() {  
    if (!this.game.isFinished())
      return;
    this.game.set('status', 'ongoing');
	  this.renderAndSave();
  },
  
  startTeam1 : function() {
    this.game.set('startTeam', 0);
	  this.renderAndSave();
  },
  
  startTeam2 : function() {
    this.game.set('startTeam', 1);
    this.renderAndSave();
  },

  // immediatly render & save in the background
  renderAndSave: function () {
    this.render();
	this.game.save(null, {
	  playerid : this.player.get('id')
	  , token : this.player.get('token')
    });
  },

  statusGame : function() {
    var that = this;
    var game = {
	    team1_id : this.game.get('teams')[0].players[0].id
	    , team2_id : this.game.get('teams')[1].players[0].id
	    , id : this.gameid 
    };
    var tennis_update;

    if (this.game.get('status') === "created") {
      game.status = "ongoing";    	          
      tennis_update = new GameModel(game);
	    tennis_update.save(null, {
	      playerid : this.player.get('id')
	    , token : this.player.get('token')
      }).done(function(model, response){
	      console.log('success ');
        $("#statusButton").html(i18n.t('game.finish'));
        that.statusScore = "ongoing";
	    });
    }
    else if ( this.statusScore === "finished") {
		  this.$(".buttonleft").addClass("ko");
	    this.infoTimeout = window.setTimeout(function () {
	      that.$(".buttonleft").removeClass("ko");
	      that.infoTimeout = null;
	    }, 2000);	    
    }
    else if ( this.statusScore === "ongoing") {
      game.status = "finished";
      //On met à jour les sets
      this.statusScore = "finished";
      game.score = this.calculScore();
      tennis_update = new GameModel(game);
	    tennis_update.save(null, {
	      playerid : this.player.get('id')
	    , token : this.player.get('token')
      }).done(function(model, response){
	      $("#statusButton").html(i18n.t('game.gamefinished'));	 
        $("#optionButton").attr("id","statusRestart");
 			  $("#statusRestart").html(i18n.t('game.restart'));
 			  //On met à jour le score
 			  var score = that.calculScore();
	      var scoreboard = score.split('/'); 
 			  $('#team1_sets_div').html('<div class="score sets">'+scoreboard[0]+'</div>');
 			  $('#team2_sets_div').html('<div class="score sets">'+scoreboard[1]+'</div>');
 			  // On efface la cache
        if (this.DB!==undefined)
          this.DB.remove("sets");
	    });
    }
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
      $("#followButton").text(i18n.t('message.nofollow'));
      this.follow = 'true';
    }
  },

  // ROUTING FUNCTIONS
  goToComment: function (elmt) {
    var route = $(elmt.currentTarget).attr("data-js-href");
    Y.Router.navigate(route, {trigger: true}); 
  },

  goToOptions : function() {
    Y.Router.navigate("/games/form/"+this.id, {trigger:true});
  },   

  goToPlayerProfile: function (elmt) {
    if (elmt.currentTarget.id) {
      var route = elmt.currentTarget.id;
      Y.Router.navigate(route, {trigger: true}); 
    }
  },

  // CLEAN
  onClose : function() {
    // desabonnements
    this.game.off("sync", this.onGameSynched, this);
    this.game.off("sync", this.onGameInit, this);
    this.streams.off("sync", this.renderCountComment, this);
    //
    if (this.infoTimeout) {
      window.clearTimeout(this.infoTimeout);
      this.infoTimeout = null;
    }
    if (this.shareTimeout) {
      window.clearTimeout(this.shareTimeout);
      this.shareTimeout = null;
    }
    // 
    if (!this.game.isMine()) this.poller.stop();
  }
});