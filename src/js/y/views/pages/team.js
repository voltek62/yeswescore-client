Y.Views.Pages.Team = Y.View.extend({
  el : "#content",
  
  playeraddid: null,

  events : {
    'click #followButton'                : 'followTeam',
    'click #addButton'                   : 'addPlayer',
    'click .button-comments'             : 'goToComment',
    'click div.ui-block-a'               : 'viewPlayer',
    'click div.ui-block-b'               : 'viewPlayer',
    'click div.ui-block-c'               : 'openStatus',
    'click a[data-fragment=iscaptain]'   : 'doCaptain',
    'click a[data-fragment=isplayer]'    : 'changeMode',
    'click a[data-fragment=issubstitute]': 'changeMode',
    'click a[data-fragment=quit]'        : 'quitTeam',            
    'click div.ui-block-c'               : 'openStatus'                 
  },
  
  listview : "#listPlayersView",  

  pageName: "team",
  pageHash : "team/",
  
  playeraddid: null,
  displayStatus: false,
  
  myinitialize : function() {
    //header
    Y.GUI.header.title(i18n.t('team.title'));
  
    // loading templates.
    this.templates = {
      list:  Y.Templates.get('list-player-team'),  
      li:  Y.Templates.get('list-player-team-li'),          
      empty: Y.Templates.get('module-empty'),
      formstatus: Y.Templates.get('module-team-formstatus'),      
      page:  Y.Templates.get('page-team'),
      pageform:  Y.Templates.get('page-teamform')      
    };
    
    // loading owner
    this.player = Y.User.getPlayer();  
    this.playerid = this.player.get('id');
    this.players_follow = Y.User.getPlayer().get('following');
        
    this.playeridArray = new Array;
        
    // we render immediatly
    this.render();        

    this.team = new TeamModel({id : this.id});   
    this.team.once('sync', this.renderTeam, this);      
    this.team.fetch();
    
    var teams_follow = Y.Conf.get("owner.teams.followed");
    if (teams_follow !== undefined)
    {
      if (teams_follow.indexOf(this.id) === -1) {
        this.follow = 'false';
      }
      else
        this.follow = 'true';          
    }
    else
      this.follow = 'false';
                
  },

  followTeam: function() {
    if (this.follow === 'true') {
      var teams_follow = Y.Conf.get("owner.teams.followed");
      if (teams_follow !== undefined)
      {
        if (teams_follow.indexOf(this.id) !== -1) {
          //On retire l'elmt
          teams_follow.splice(teams_follow.indexOf(this.id), 1);
          Y.Conf.set("owner.teams.followed", teams_follow, { permanent: true });
        }
      }
      $('span.success').css({display:"block"});
      $('span.success').html(i18n.t('message.nofollowclubok')).show();
      $("#followButton").text(i18n.t('message.follow'));
      $('#followButton').removeClass('button-selected');
      $('#followButton').addClass('button'); 
      this.follow = 'false';
    } else {
      //Via localStorage
      var teams_follow = Y.Conf.get("owner.teams.followed");
      if (teams_follow !== undefined)
      {
        if (teams_follow.indexOf(this.id) === -1) {
          teams_follow.push(this.id);
          Y.Conf.set("owner.teams.followed", teams_follow, { permanent: true });
        }
      }
      else
        Y.Conf.set("owner.teams.followed", [this.id]);
      $('span.success').css({display:"block"});
      $('span.success').html(i18n.t('message.followteamok')).show();
      $("#followButton").text(i18n.t('message.nofollow'));
      $('#followButton').removeClass('button');
      $('#followButton').addClass('button-selected');          
      this.follow = 'true';
    }
  },
  
  openStatus : function() { 
    if (this.displayStatus==false) {
      this.displayStatus=true;
      $('#listPlayersView li:contains("'+this.player.get('name')+'")').after(
        this.templates.formstatus({
          captain : i18n.t('team.captain')
          , player : i18n.t('team.player')
          , substitute : i18n.t('team.substitute')
          , quit : i18n.t('team.quit')
        })
      ).i18n();
      
      // isCaptain
      // isPlayer
      // isSubsitute
      if (this.playeridArray.indexOf(this.playerid)!=-1)
        this.$('a[data-fragment=isplayer]').addClass("highlighted");
      if (typeof this.team.get('captain') !== "undefined")  
        if (this.team.get('captain').id === this.playerid)
          this.$('a[data-fragment=iscaptain]').addClass("highlighted");        
      
    }
    else {
      this.displayStatus=false;
      $('#formstatus').remove();
    }
  },

  viewPlayer : function(elmt) { 
    var href= $(elmt.currentTarget).data('href');

    if (href) {
      var route = href;
      Y.Router.navigate(route, {trigger: true}); 
    }  
  },
  
  changeMode: function() {
    console.log('changeMode ON');
   
    //close status ?
    //this.displayStatus=false;
    //$('#formstatus').remove();     
  },     


  doCaptain: function() {

    var team = new TeamModel({
      id:this.teamid,
      name:this.teamname
    });
    
    
    //team.set('captain', this.playerid);
    if (this.team.get('captain').id === this.playerid) {
      team.set('captain', '');  
      console.log('captain vide'); 
    }
    else
      team.set('captain', this.playerid);  
     
    this.updateTeam(team);
    
               
  },  

  quitTeam: function() {
    
    var team = new TeamModel({
      id:this.teamid,
      name:this.teamname
    });
    
    if (this.playeridArray !== undefined)
    {
      if (this.playeridArray.indexOf(this.playeraddid) !== -1) {
        that.playeridArray.splice(this.playeridArray.indexOf(this.playerid), 1);
        team.set('players', this.playeridArray);  
        this.updateTeam(team);
      }
    }
                   
  },    
  
  addPlayer: function() {

    if (this.playeridArray !== undefined)
    {
      if (this.playeridArray.indexOf(this.playeraddid) === -1) {
        this.playeridArray.push(this.playeraddid);
      }
      else {
        //already exists
        this.$("#team").val(' ');
        return;
      }
    }
    else
      this.playeridArray = [this.playeraddid]; 

    var team = new TeamModel({
      id:this.teamid,
      name:this.teamname
    });
    team.set('players', this.playeridArray);  
    
    this.updateTeam(team);
  
  },  

  updatingTeam: false,  
  updateTeam: function(team) {
        
    if (this.updatingTeam)
      return; // already sending => disabled.          
    
    this.updatingTeam = true;  
    
    
    var that = this;    
    team.save(null, {
      playerid: this.player.get('id'),
      token: this.player.get('token')
    }).done(function (model, response) {    
      that.updatingTeam = false;     
              
      if(that.$("#team").val()!=='') {
        
        var player = model.players[model.players.length-1];

        var playersImgUrl = "";
        if (typeof player.profile !== "undefined")
          if(player.profile.image!=="")
            playersImgUrl = PlayerModel.getExtractImageUrl(player.profile.image);
          else
            playersImgUrl = Y.Conf.get("gui.image.placeholder.profil");
        else
          playersImgUrl = Y.Conf.get("gui.image.placeholder.profil");      
      
	    that.$('#listPlayersView').append(that.templates.li({player:player,playersImgUrl:playersImgUrl}));
	    that.$("#team").val(' ');
	    that.playeridArray.push(player.id);
	    

	  }   
	  
      if (that.team.get('captain').id === that.playerid)
        that.$('a[data-fragment=iscaptain]').addClass("highlighted");
      else
        that.$('a[data-fragment=iscaptain]').removeClass("highlighted");	   
            
    }).fail(function (err) {       
      that.updatingTeam = false;  
      
  
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
        callback(null, players.splice(0, 4).map(function (p) {

          p.text = p.name; 

          if (p.rank)
            p.text += " "+p.rank+"";
            
          if (p.club !== undefined && p.club.name !== undefined) {
            p.text += " ( "+p.club.name+" )";
          }
          return p; 
        }),'player');
      } else {
        callback(null, [], 'default');
      }
    }).fail(function (xhr, error) { 
      callback(error);
    });
  },

  autocompleteTeam: function (data) {
    if (data && data.name) {
      this.$("#team").val(data.name);
      this.playeraddid = data.id;
    }
  },

  renderCountComment : function() {
  
    //var nbComments = this.streams.length;
    var nbComments = this.team.get('streamCommentsSize') + this.team.get('streamImagesSize');
  
    if (nbComments > Y.Conf.get("game.max.comments") )
      this.$(".link-comments").html(i18n.t('game.50lastcomments'));
    else if (nbComments == 1)
      this.$(".link-comments").html(i18n.t('game.1comment'));
    else if (nbComments > 0)
      this.$(".link-comments").html(nbComments + " "+i18n.t('game.comments'));
    else
      this.$(".link-comments").html(i18n.t('game.0comment'));
  },  

  render: function () {
    // empty page.
    this.$el.html(this.templates.empty());
    return this;
  },
  
 
  // render the content into div of view
  renderTeam : function() {
  
    this.teamid = this.team.get('id');
    this.teamname = this.team.get('name');
   
    var playersImgUrl = [];
    
    var i=0;    
	for(var o in this.team.get('players')) {
      this.playeridArray.push(this.team.get('players')[o].id);
      
      //recup img
      if (typeof this.team.get('players')[o].profile !== "undefined" && this.team.get('players')[o].profile.image !== "")
        playersImgUrl[i] = PlayerModel.getExtractImageUrl(this.team.get('players')[o].profile.image);
      else
        playersImgUrl[i] = Y.Conf.get("gui.image.placeholder.profil");
        
      i++;
	}
    
    if (this.playeridArray.indexOf(this.player.get('id'))!=-1) {
      this.$el.html(this.templates.pageform({
        team : this.team.toJSON()
        , follow:this.follow
      }));    
    }
    else { 
      this.$el.html(this.templates.page({
        team : this.team.toJSON()
        , follow:this.follow
      }));
    }
    
    //display players
	$(this.listview).html(this.templates.list({
			team:this.team.toJSON()
            , players:this.team.toJSON().players
            , playeridArray : this.playeridArray
            , query:' '
            , playerid : this.playerid
            , playersImgUrl : playersImgUrl
          })).i18n();    
    
    //display comments
    this.renderCountComment();
    
    this.$el.i18n();
    return this;
  },

  // ROUTING FUNCTIONS
  goToComment: function (elmt) {
    var route = $(elmt.currentTarget).attr("data-js-href");
    Y.Router.navigate(route, {trigger: true}); 
  },

  onClose : function() {
    this.undelegateEvents();
    this.team.off("sync", this.renderTeam, this);
  }
});