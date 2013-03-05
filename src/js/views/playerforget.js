var PlayerForgetView = Backbone.View.extend({
  el : "#content",

  events: {
    'submit form#frmForgetPlayer' : 'forget'
  },

  pageName: "playerForget",

  initialize : function() {
    this.playerForgetTemplate = Y.Templates.get('playerForgetTemplate');
    this.render();
    //$.mobile.hidePageLoadingMsg();
  },

  forget : function(event) {
    var email = $('#email').val();

    console.log('test mot de passe oublie avec ' + email);
    
    this.player = new PlayerModel();
    this.player.newpass(email);
    
    return false;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.playerForgetTemplate({}));
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose : function() {
    this.undelegateEvents();
  }
});
