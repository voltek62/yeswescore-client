var ClubAddView = Backbone.View.extend({
  el: "#content",

  events: {
    'submit form#frmAddClub': 'addClub'
  },

  pageName: "clubAdd",

  initialize: function () {

    this.clubAddTemplate = Y.Templates.get('clubAddTemplate');

    this.Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));

    this.render();
    //$.mobile.hidePageLoadingMsg();
  },

 

  addClub: function (event) {

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
    this.$el.html(this.clubAddTemplate({ playerid: this.Owner.id, token: this.Owner.token }));
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose: function () {
    //Clean
    this.undelegateEvents();

  }
});