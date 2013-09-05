Y.Views.Pages.Teams = Y.View.extend({
  el : "#content",

  events : {
    "keyup input#search-basic": "searchOnKeyTeam",  
    //"blur input#search-basic": "searchOnBlur",
    "click div.ui-block-a": "chooseTeam",
    "click div.ui-block-b": "chooseTeam",
    "click div.ui-block-c": "followTeam"
  },

  listview : "#listTeamsView",

  pageName: "teamList",
  pageHash : "teams/list", 
  // one by one
  following: false,
  dataid:"",
  datafollow:"",
  button: true,  
  
  myinitialize : function(param) {

    // saving parameter
    this.param = param || {};
    
    console.log('teams');
      
    //header
    if (this.param.mode === 'follow')    
      Y.GUI.header.title(i18n.t('teamlist.titlefollow')); 
    else
      Y.GUI.header.title(i18n.t('teamlist.title'));
      
    // loading templates.
    this.templates = {
      list      : Y.Templates.get('list-team'),
      page      : Y.Templates.get('page-teams'),
      error     : Y.Templates.get('module-error'),    
      ongoing   : Y.Templates.get('module-ongoing')
    };
    
    // we render immediatly
    this.render();  
    
    var teams = Y.Conf.get("owner.teams.followed");
    if (typeof teams !== "undefined")
      this.teams_follow = teams;   
    else
       this.teams_follow = [];  
        
    this.myid = Y.User.getPlayer().get('id');
    this.mytoken = Y.User.getPlayer().get('token'); 

    //load teams via localstorage
    if (this.param.mode === 'follow') {
      if (teams!==undefined) {
        this.teamLast = teams[teams.length-1];     
        this.collection = new TeamsCollection();  
        var that = this;  
        var i = teams.length;  
      
        if (teams.length<1) {
          $(this.listview).html(this.templates.list({
            teams:[]
            , query:' '
            , teams_follow : this.teams_follow
          })).i18n();              
        }      
      
        this.syncTeam = function (team) { 
          that.collection.add(team);
          i--;
            //si dernier element du tableau
          if (that.teamLast === team.get('id')) {
            $(that.listview).html(that.templates.list({
              teams:that.collection.toJSON()
              , query:' '
              , teams_follow : this.teams_follow
            })).i18n();   
          }             
        };      
      
        this.teams = [];      
        teams.forEach(function (teamid,index) {  
          var team = new TeamModel({id : teamid});          
          team.once("sync", this.syncTeam, this);          
          team.fetch().fail(function (xhrResult, error) {          
            if (teams.indexOf(teamid) !== -1) {
              teams.splice(teams.indexOf(teamid), 1);
              //On retire la team qui n'existe plus              
              Y.Conf.set("owner.teams.followed", clubs, { permanent: true });
              
              if (teams.length<1) {
                $(that.listview).html(that.templates.list({
                  teams:[]
                  , query:' '
                  , teams_follow : this.teams_follow
                })).i18n();              
            }
            else
              this.teamLast = teams[teams.length-1];
                
          }
        });         

        this.teams[index] = team;  
                    
        },this);
      }
      else {   
        $(this.listview).html(this.templates.list({
          teams:[]
          , query:' ' 
          , teams_follow : this.teams_follow
        })).i18n();
      }  
    }
    else {
      this.teams = new TeamsCollection();
      this.teams.once('sync', this.renderList, this);           
      this.teams.fetch();
     
    }
    
  },

  chooseTeam : function(elmt) { 
    var href= $(elmt.currentTarget).data('href');

    if (href) {
      var route = href;
      Y.Router.navigate(route, {trigger: true}); 
    }  
  },  

  searchOnKeyTeam: function (event) {
    
    if(event.keyCode == 13){
      // the user has pressed on ENTER
      this.inputModeOff();
      this.searchTeams();
    }
    return this;
  },

  //searchOnBlur: function (event) {
  //  this.searchPlayers();
  //  return this;
  //},   

  searchTeams:function(q) {
    console.log('searchTeams');
    var q = $("#search-basic").val();
    $(this.listview).html(this.templates.error()); 
    this.teams = new TeamsCollection();       
    this.teams.setMode('search',q);
    this.teams.fetch().done($.proxy(function () {      
      if (this.teams.toJSON().length === 0) {
        $(this.listview).html(this.templates.error());
      }
      else
        $(this.listview).html(this.templates.list({ 
          teams: this.teams.toJSON()
          , query: q
          , teams_follow : this.teams_follow 
        }));
           
      $(this.listview).i18n();
    }, this));
    
    this.$el.i18n();
    
    return this;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.templates.page({ button:this.button })).i18n();
    return this;
  },

  renderList : function(q) {
    $(this.listview).html(this.templates.list({
      teams : this.teams.toJSON()
      , query : q
      , teams_follow : this.teams_follow
    })).i18n();

    return this;
  },

  followTeam: function(elmt) {
  
    this.dataid = $(elmt.currentTarget).data('teamid');
    this.datafollow = $(elmt.currentTarget).data('follow');          
    
    if (this.following)
      return;   
    
    var that = this;
         
    if (this.datafollow === true) {
    
      console.log('datafollow true '+this.dataid);

      if (this.teams_follow !== undefined)
      {
        if (this.teams_follow.indexOf(this.dataid) !== -1) {
          //On retire l'elmt
          this.teams_follow.splice(this.teams_follow.indexOf(this.dataid), 1);
          Y.Conf.set("owner.teams.followed", this.teams_follow, { permanent: true });

		  //change text
		  $('.ui-block-c[data-teamid='+this.dataid+']>span.form-button').html(i18n.t('teamlist.follow'));
		  $('.ui-block-c[data-teamid='+this.dataid+']').data('follow',false);          
        }
      }
	  /*
	  FIX if we save following teams on mongo
      this.following = true;
      Backbone.ajax({
        dataType: 'json',
        url: Y.Conf.get("api.url.teams") +this.myid+"/following/?playerid="+this.myid+"&token="+this.mytoken+"&_method=delete",
        type: 'POST',
        data: {
          id: this.dataid
        },
        success: function (data) {
          that.following = false;
          
        //On supprime l'id
        if (that.teams_follow !== undefined)
        {
          if (that.teams_follow.indexOf(that.dataid) !== -1) {
          //On retire l'elmt
            that.teams_follow.splice(that.teams_follow.indexOf(that.dataid), 1);
            var data = {id: that.myid, following: that.teams_follow };
            Y.User.updatePlayer(data);
          }
        }
        
        //change text
        $('.ui-block-c[data-teamid='+that.dataid+']>span.form-button').html(i18n.t('message.follow'));
        $('.ui-block-c[data-teamid='+that.dataid+']').data('follow',false);
        //$('.ui-block-c[data-playerid='+that.dataid+']>span.form-button').attr('data-follow','false');                
          
        },
        error: function (err) {
          that.following = false;
          //that.displayError(i18n.t('message.error'));
          console.log(i18n.t('message.error'));
        }
      });
      */      
      

    } else {  
        console.log('datafollow false '+this.dataid);
        
	    if (this.teams_follow !== undefined)
	    {
	      if (this.teams_follow.indexOf(this.dataid) === -1) {
	        this.teams_follow.push(this.dataid);
	        Y.Conf.set("owner.teams.followed", this.teams_follow, { permanent: true });
	      }
	    }
	    else
	      Y.Conf.set("owner.teams.followed", [this.dataid]);
	      
		//change text
		$('.ui-block-c[data-teamid='+this.dataid+']>span.form-button').html(i18n.t('teamlist.nofollow'));
		$('.ui-block-c[data-teamid='+this.dataid+']').data('follow',true);                 
    }  
  
  },   
  

  onClose : function() {
    this.undelegateEvents();

    if (this.param.mode === 'follow') {    
      if (this.teams!==undefined) {
        this.teams.forEach(function (team) {
          team.off("sync", this.syncTeam, this);
        }, this);
      }
    }
    else {
      this.teams.off('sync', this.renderList, this);  
    }   
  }
  
});
