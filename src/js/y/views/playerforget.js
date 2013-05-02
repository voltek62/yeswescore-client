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
  
    var mail = $('#email').val();

	Backbone.ajax({
      dataType: 'json',
      url: Y.Conf.get("api.url.auth") + "resetPassword/",
      type: 'POST',
      data: {
        email: { address: mail }
      },
      success: function (data) {

        console.log('data result Reset Password', data);

        $('span.success').html(i18n.t('message.mailspam')).show();

      }
    });
        
    return this;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.playerForgetTemplate({}));
    
    this.$el.i18n();

    return this;
  },

  onClose : function() {
    this.undelegateEvents();
  }
});
