Y.Views.Pages.TeamAdd = Y.View.extend({
  el: "#content",

  events: {
    'submit form#frmAddTeam': 'addTeam'
  },

  pageName: "teamAdd",
  pageHash : "teams/add",
  playerid : "",
  token : "",

  myinitialize: function () {
    Y.GUI.header.title(i18n.t('teamadd.title'));

    this.page = Y.Templates.get('page-teamadd');

    this.owner = Y.User.getPlayer();    
    this.token = this.owner.get('token');
    this.playerid = this.owner.get('id');  

    this.render();
  },

  addTeam: function (event) {
    $("#navbar").show();
    $("#content").css("bottom", "48px");
    
    var name = $('#name').val()
      , city = $('#city').val();
    
    var team = new TeamModel({
      name: name         
    });

    team.save();    
   
    return false;
  },

  render: function () {
    this.$el.html(this.page({}));
    this.$el.i18n();
    return this;
  }
});