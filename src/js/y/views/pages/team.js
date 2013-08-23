Y.Views.Pages.Team = Y.View.extend({
  el : "#content",

  events : {
    'click #followButton' : 'followTeam'
  },

  pageName: "team",
  pageHash : "team/",
  
  initialize : function() {
    //header
    Y.GUI.header.title(i18n.t('team.title'));
  
    // loading templates.
    this.templates = {
      empty: Y.Templates.get('module-empty'),
      page:  Y.Templates.get('page-team')
    };
    
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

  render: function () {
    // empty page.
    this.$el.html(this.templates.empty());
    return this;
  },
  
 
  // render the content into div of view
  renderTeam : function() {
    this.$el.html(this.templates.page({
      team : this.team.toJSON(),follow:this.follow
    }));
    this.$el.i18n();
    return this;
  },

  onClose : function() {
    this.undelegateEvents();
    this.team.off("sync", this.renderTeam, this);
  }
});