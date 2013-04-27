Y.Views.PlayerForget = Y.View.extend({
  el : "#content",

  events: {
  
    'focus input[type="text"]': 'inputModeOn',
    'blur input[type="text"]': 'inputModeOff',
  
    'click #forgetPlayer' : 'forget'

  },

  pageName: "playerForget",
  pageHash : "players/forget",
  
  initialize : function() {
  
    Y.GUI.header.title("MOT DE PASSE OUBLIE");     
  
    this.playerForgetTemplate = Y.Templates.get('playerForget');
    this.render();
    //$.mobile.hidePageLoadingMsg();
  },
  

  forget : function(event) {
  
    var email = $('#email').val();

    //console.log('test mot de passe oublie avec ' + email);
    
    this.player = new PlayerModel();
    this.player.newpass(email);
    
    
    return false;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.playerForgetTemplate({}));

    return this;
  },

  onClose : function() {
    this.undelegateEvents();
  }
});
