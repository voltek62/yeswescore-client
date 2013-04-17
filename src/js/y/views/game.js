Y.Views.Game = Y.View.extend({
      el : "#content",
      
      displayViewScoreBoard : "#scoreBoard",
      // Flux des commentaires
      // FIXME: sort by priority
      incomingComment : "#incomingComment",      
      countComment : "#countComment",
      
      events : {
        'click #facebook' : 'fbconnect',
        'click #setPlusSetButton' : 'setPlusSet',
        'click #setMinusSetButton' : 'setMinusSet',
        'click #setPointWinButton' : 'setPointWin',
        'click #setPointErrorButton' : 'setPointError',
        'click #endButton' : 'endGame',
        'click #followButton' : 'followGame',
        'click #cancelButton' : 'cancelGame',
        'click #optionButton' : 'optionGame',        
        'click #team1_set1_div' : 'setTeam1Set1',
        'click #team1_set2_div' : 'setTeam1Set2',
        'click #team1_set3_div' : 'setTeam1Set3',
        'click #team2_set1_div' : 'setTeam2Set1',
        'click #team2_set2_div' : 'setTeam2Set2',
        'click #team2_set3_div' : 'setTeam2Set3',
        "click .button-comments": "goToComment",       
      },

      pageName: "game",
      pageHash : "games/",

      initialize : function() {
      
        //$.ui.scrollToTop('#content');
		//On met à jour le pageHash
        this.pageHash += this.id; 
      

        Y.GUI.header.title("MATCH");
      	
      	
        // FIXME : temps de rafrichissement selon batterie et selon forfait
        this.gameViewTemplate = Y.Templates.get('game');
        this.gameViewScoreBoardTemplate = Y.Templates
            .get('gameScoreBoard');
        this.gameViewCommentListTemplate = Y.Templates
            .get('gameCommentList');

		//console.log('1.0');

        this.Owner = Y.User.getPlayer();
		this.score = new GameModel({id : this.id});
		
		//console.log('1.1');		
		
        this.score.fetch();

		//console.log('1.2');

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
          
        
        var options = {
          delay : Y.Conf.get("game.refresh")
        };


		//console.log('1.3');

        this.render();                                // rendu a vide (instantanément)
        this.score.once("sync",this.render,this);      // rendu complet (1 seule fois)   PERFS: il faudrait un render spécial.
        // FIXME: SI ONLINE       
        //poller = Backbone.Poller.get(this.score, options)
        //poller.start();
        //poller.on('sync', this.render, this);
        
		//console.log('1.4');

        
        //On compte les commentaires
        this.streams = new StreamsCollection({id : this.id});
    	this.streams.fetch();
    	this.streams.once("sync",this.renderCountComment,this); 
    	
    	//console.log('1.5');
    	
        
      },


	  fbconnect: function () {
	    console.log('facebook connect');
	    Y.Facebook.connect();
	  },
 
      updateOnEnter : function(e) {
        if (e.keyCode == 13) {
          console.log('touche entrée envoie le commentaire');
          this.commentSend();
        }
      },
      
      goToComment: function (elmt) { 
    	console.log('goToComment',elmt.currentTarget.id); 
    	var route = elmt.currentTarget.id;
    	Y.Router.navigate(route, {trigger: true}); 
  	  },

      setTeamSet : function(input, div) {
        if ($.isNumeric(input.val()))
          set = parseInt(input.val(), 10) + 1;
        else
          set = '1';

        input.val(set);
        
        //FIXME : NO HTML IN CODE
        div.html('<div class="score">'+set+'</div>');
        
        this.sendUpdater();
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
        // formData = new FormData($(this)[0]);
        console.log('date-form', data);

        /*
         * $.ajax({ type:'POST', url:urlServiceUpload, data:formData,2
         * contentType: false, processData: false, error:function (jqXHR,
         * textStatus, errorThrown) { alert('Failed to upload file') },
         * success:function () { alert('File uploaded')
         */
        return false;
      },

      sendUpdater : function() {
        // console.log('action setPlusSet avec
        // '+$('input[name=team_selected]:checked').val());

        // ADD SERVICE
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
        

        tennis_update = new GameModel(game);
        tennis_update.save();

        // FIXME: on ajoute dans le stream un changement de score ???
        /*
        var stream = new StreamModel({
          type : "score",
          playerid : playerid,
          token : token,
          text : sets_update,
          gameid : gameid
        });
        // console.log('stream',stream);
        stream.save();
        */
        
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
          // On ajoute 1 set au gagnant les point repartent à zero
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
            // On met l'adversaire à zéro
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
        
        console.log('renderRefresh');
        
        $(this.displayViewScoreBoard).html(this.gameViewScoreBoardTemplate({
          game : this.score.toJSON(),
          Owner : this.Owner
        }));
             
        
        return false;
      },

	  renderCountComment : function() {
	  
	    var counter = 0;
	    if (this.streams.toJSON().length>0)
			counter = this.streams.toJSON().length;

        $(this.countComment).html(counter);

	  },

      render : function() {
        // On rafraichit tout
        
        //console.log("3.0 ",this.score.toJSON());
        
        // FIXME: refresh only input and id
        this.$el.html(this.gameViewTemplate({
          game : this.score.toJSON(),
          Owner : this.Owner.toJSON(),
          follow : this.follow
        }));

        /* css transition: performance issues: disabled
        var $buttonCommentaires = this.$(".button-commentaires");
        setTimeout(function () {
          $buttonCommentaires.css("height", "87px");
        }, 100);
        */
        
		
        $(this.displayViewScoreBoard).html(this.gameViewScoreBoardTemplate({
          game : this.score.toJSON(),
          Owner : this.Owner.toJSON()
        }));
		

        return this;
      },

      alertDismissed : function() {
        // do something
      },

      endGame : function() {
        //window.location.href = '#games/end/' + this.id;
        Y.Router.navigate("/games/end/"+this.id,{trigger:true})
      },
      
      optionGame : function() {
        //console.log('option Game /games/form/'+this.id);
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
        this.score.off("sync",this.render,this);
        //this.score.off("all",this.renderRefresh,this);
        
        // FIXME:remettre
        //poller.stop();
        //poller.off('sync', this.render, this);

        // FIXME:
        // poller.off('complete', this.render, this);
        // this.$el.off('pagebeforeshow');
      }
    });