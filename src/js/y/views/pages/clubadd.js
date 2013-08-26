Y.Views.Pages.ClubAdd = Y.View.extend({
  el: "#content",

  events: {
    'mousedown .button': 'addClub'
  },

  pageName: "clubAdd",
  pageHash : "clubs/add",

  myinitialize: function () {
    Y.GUI.header.title(i18n.t('clubadd.title'));

    this.page = Y.Templates.get('page-clubadd');

    this.player = Y.User.getPlayer();

    this.render();
  },
  
  addingClub: false,
  addClub: function (event) {
    
    var name = $('#name').val()
      , city = $('#city').val();
      
    if (this.addingClub)
      return; // already sending => disabled.        
    
    this.addingClub = true;
    
    var club = new ClubModel({
      name: name
    , city: city          
    });

    var that = this;
    club.save(null, {
      playerid: this.player.get('id'),
      token: this.player.get('token')
    }).done(function(model, response){
      that.addingClub = false; 
      Y.Router.navigate('clubs/'+model.id, {trigger: true}); 
    }).fail(function (err) {
      that.$(".button").addClass("ko");
      that.shareTimeout = window.setTimeout(function () {
        that.$(".button").removeClass("ko");
        that.shareTimeout = null;
        that.$('.button').removeClass("disabled");    
      }, 4000);
      that.addingClub = false;   
   });     
   
    return false;
  },

  render: function () {
    this.$el.html(this.page({}));
    this.$el.i18n();
    return this;
  }
});