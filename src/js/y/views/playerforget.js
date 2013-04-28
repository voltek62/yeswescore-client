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
  
    Y.GUI.header.title(i18n.t('playerforget.title'));     
  
    this.playerForgetTemplate = Y.Templates.get('playerForget');
    this.render();

  },
  

  forget : function(event) {
  
    var email = $('#email').val();

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
