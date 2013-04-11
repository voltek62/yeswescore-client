Y.Views.PlayerSignin = Y.View.extend({
  el : "#content",

  events: {
    'submit form#frmSigninPlayer' : 'signin',
    'click input' :'hideFooter'
  },

  pageName: "playerSignin",
  pageHash : "players/signin", 

  initialize : function() {
  
    Y.GUI.header.title("CONNEXION");     
  
    this.playerSigninTemplate = Y.Templates.get('playerSignin');
    this.render();
    //$.mobile.hidePageLoadingMsg();
  },
  
  hideFooter:function() {
  	console.log('hideFooter');
  	//$.ui.toggleNavMenu(false);
  },    

  signin : function(event) {
  
    //$.ui.toggleNavMenu(true);
  
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
