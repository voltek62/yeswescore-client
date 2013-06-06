Y.Views.PlayerSignin = Y.View.extend({
  el : "#content",

  events: {
    'click #signinUser' : 'signin',
    'click #forgetPassword' : 'forget'    
  },

  pageName: "playerSignin",
  pageHash : "players/signin", 
  shareTimeout: null,  

  myinitialize : function() {
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
    var that = this;

	  Backbone.ajax({
      dataType: 'json',
      url: Y.Conf.get("api.url.auth"),
      type: 'POST',
      data: {
        email: { address: mail },
        uncryptedPassword: password
      },
      success: function (result) {
        var player;

		    $('div.success').css({display:"block"});
		    $('div.success').html(i18n.t('message.signinok')).show();
		    $('div.success').i18n();
		    player = new PlayerModel(result);	
		    Y.User.setPlayer(player);
	      that.shareTimeout = window.setTimeout(function () {
      		  Y.Router.navigate("players/form", {trigger: true});
      		  that.shareTimeout = null;
    	  }, 2000);
      },
      error: function (err) {
	      $('div.error').css({display:"block"});
		    $('div.error').html(i18n.t('message.signinerror')).show();
		    $('div.error').i18n();
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
    if (this.shareTimeout) {
      window.clearTimeout(this.shareTimeout);
      this.shareTimeout = null;
    }
  }
});
