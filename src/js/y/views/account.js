var AccountView = Backbone.View.extend({
  el: "#content",

  events: {
    'click #fbconnect': 'fbconnect'
  },

  pageName: "account",

  initialize: function () {

    this.accountViewTemplate = Y.Templates.get('accountViewTemplate');

    this.Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));


    this.render();
  },


  fbconnect: function () {
    console.log('facebook connect');
    Y.Facebook.connect();
  },

  // render the content into div of view
  render: function () {


    $(this.el).html(this.accountViewTemplate({
      Owner: this.Owner
    }));

    $(this.el).trigger('pagecreate');

    // this.$el.html(this.accountViewTemplate(),{Owner:Owner});
    // $.mobile.hidePageLoadingMsg();
    // this.$el.trigger('pagecreate');


    return this;
  },

  onClose: function () {
    this.undelegateEvents();
  }
});