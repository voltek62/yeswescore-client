Y.Views.ClubAdd = Y.View.extend({
  el: "#content",

  events: {
    'submit form#frmAddClub': 'addClub'
  },

  pageName: "clubAdd",
  pageHash : "clubs/add",

  initialize: function () {
  
    Y.GUI.header.title("AJOUTER UN CLUB");

    this.clubAddTemplate = Y.Templates.get('clubAdd');

    this.owner = Y.User.getPlayer();

    this.render();
    //$.mobile.hidePageLoadingMsg();
  },


  addClub: function (event) {
  
    jq("#navbar").show();
    jq("#content").css("bottom", "48px");
    //$.ui.showNavMenu = true;

    console.log('add Club');
    
    var name = $('#name').val()
    , city = $('#city').val();
    
    var club = new ClubModel({
      name: name
    , city: city          
    });

    console.log('club form envoie ',club.toJSON());
  
    club.save();    
   
    return false;
  },

  //render the content into div of view
  render: function () {
    this.$el.html(this.clubAddTemplate({ playerid: this.owner.id, token: this.owner.token }));
    //this.$el.trigger('pagecreate');
    return this;
  },

  onClose: function () {
    //Clean
    this.undelegateEvents();

  }
});