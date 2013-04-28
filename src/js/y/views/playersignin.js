Y.Views.PlayerSignin = Y.View.extend({
  el : "#content",

  events: {
  
    'focus input[type="text"]': 'inputModeOn',
    'blur input[type="text"]': 'inputModeOff',
    
    'click #signinUser' : 'signin',
    'click #forgetPassword' : 'forget'    
    
  },

  pageName: "playerSignin",
  pageHash : "players/signin", 

  initialize : function() {
  
    Y.GUI.header.title(i18n.t('playersignin.title'));     
  
    this.playerSigninTemplate = Y.Templates.get('playerSignin');
    this.render();

  },
  

  forget : function(event) {

   	Y.Router.navigate("/players/forget", {trigger: true}); 
  
  }, 

  signin : function(event) {
  
    var email = $('#email').val();
    var password = $('#password').val();

    this.player = new PlayerModel();
    this.player.login(email, password);
    return false;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.playerSigninTemplate({}));

    return this;
  },

  onClose : function() {
    this.undelegateEvents();
  }
});
