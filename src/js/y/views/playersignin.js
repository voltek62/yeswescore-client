var PlayerSigninView = Backbone.View.extend({
  el : "#content",

  events: {
    'submit form#frmSigninPlayer' : 'signin',
    'click input' :'hideFooter'
  },

  pageName: "playerSignin",

  initialize : function() {
  
    $.ui.setBackButtonVisibility(true);
    $.ui.setBackButtonText("&lt;");
    $.ui.setTitle("CONNEXION");	    
  
    this.playerSigninTemplate = Y.Templates.get('playerSigninTemplate');
    this.render();
    //$.mobile.hidePageLoadingMsg();
  },
  
  hideFooter:function() {
  	console.log('hideFooter');
  	$.ui.toggleNavMenu(false);
  },    

  signin : function(event) {
  
    $.ui.toggleNavMenu(true);
  
    var email = $('#email').val();
    var password = $('#password').val();

    console.log('test authentification avec ' + email);
    this.player = new PlayerModel();
    this.player.login(email, password);
    return false;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.playerSigninTemplate({}));
    //this.$el.trigger('pagecreate');
    return this;
  },

  onClose : function() {
    this.undelegateEvents();
  }
});
