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
  
    var mail = $('#email').val().replace(/ /g, "");
    var password = $('#password').val().replace(/ /g, "");

	Backbone.ajax({
      dataType: 'json',
      url: Y.Conf.get("api.url.auth"),
      type: 'POST',
      data: {
        email: { address: mail },
        uncryptedPassword: password
      },
      success: function (result) {

		$('span.success').css({display:"block"});
		$('span.success').html(i18n.t('message.signinok')).show();
		$('span.success').i18n();
		
		var player = new PlayerModel(result);	
		Y.User.setPlayer(player);

		//console.log('ANDROID result '+JSON.stringify(result));		
		//console.log('ANDROID player'+player.toJSON());
		
      },
      error: function (err) {

	    $('span.success').css({display:"block"});
	    console.log('erreur',err);
		$('span.success').html(i18n.t('message.signinerror')).show();
		$('span.success').i18n();
     
      }      
    });
    
    return this;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.playerSigninTemplate({}));

	this.$el.i18n();

    return this;
  },

  onClose : function() {
    this.undelegateEvents();
  }
});
