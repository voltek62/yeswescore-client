var AccountView = Backbone.View.extend({
  el: "#content",

  events: {
    'click #fbconnect': 'fbconnect'
  },

  pageName: "account",
  pageHash : "account", 
  

  initialize: function () {
  
    $.ui.setTitle("MON COMPTE");	

    this.accountViewTemplate = Y.Templates.get('accountViewTemplate');

    this.Owner = Y.User.getPlayer();

    this.render();
  },


  fbconnect: function () {
    console.log('facebook connect');
    Y.Facebook.connect();
  },

  // render the content into div of view
  render: function () {
    $.ui.setTitle("MON COMPTE");

    $(this.el).html(this.accountViewTemplate({
      Owner: this.Owner
    }));

    //$(this.el).trigger('pagecreate');

    // this.$el.html(this.accountViewTemplate(),{Owner:Owner});
    // $.mobile.hidePageLoadingMsg();
    // this.$el.trigger('pagecreate');


    return this;
  },

  onClose: function () {
    this.undelegateEvents();
  }
});