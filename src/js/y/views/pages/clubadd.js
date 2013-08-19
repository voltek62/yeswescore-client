Y.Views.Pages.ClubAdd = Y.View.extend({
  el: "#content",

  events: {
    'submit form#frmAddClub': 'addClub'
  },

  pageName: "clubAdd",
  pageHash : "clubs/add",
  playerid : "",
  token : "",

  myinitialize: function () {
    Y.GUI.header.title(i18n.t('clubadd.title'));

    this.page = Y.Templates.get('page-clubadd');

    this.owner = Y.User.getPlayer();    
    this.token = this.owner.get('token');
    this.playerid = this.owner.get('id');  

    this.render();
  },

  addClub: function (event) {
    $("#navbar").show();
    $("#content").css("bottom", "48px");
    
    var name = $('#name').val()
      , city = $('#city').val();
    
    var club = new ClubModel({
      name: name
    , city: city          
    });

    club.save();    
   
    return false;
  },

  render: function () {
    this.$el.html(this.page({}));
    return this;
  }
});