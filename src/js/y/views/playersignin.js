Y.Views.PlayerSignin = Y.View.extend({
  el : "#content",

  events: {
    'click #connexion' : 'connexion',
    'click #deconnexion' : 'deconnexion',
    'click #forgetPassword' : 'forget',
    'keyup #email': 'onKeyupEmail'
  },

  pageName: "playerSignin",
  pageHash : "players/signin",

  status: {
    UNREGISTERED: "unregistered",
    REGISTERED: "registered",
    REGISTERING: "registering",
    LOGIN: "login",
    current: null
  },

  myinitialize : function() {
    // title
    Y.GUI.header.title(i18n.t('playersignin.title'));     
    // loading template
    this.playerSigninTemplate = Y.Templates.get('playerSignin');
    // loading status
    this.player = Y.User.getPlayer();
    if (this.player &&
        this.player.get('email') &&
        this.player.get('email').address) {
      this.status.current = this.status.REGISTERED;
    } else {
      this.status.current = this.status.UNREGISTERED;
    }
    // rendering will switch between status.
    this.render();
  },

  // FIXME: should be generic feature for forms.
  onKeyupEmail: function (event) {
    if (event.keyCode == 13){
      // the user has pressed on ENTER
      this.connexion();
    }
    return this;
  },

  forget : function(event) {
   	Y.Router.navigate("/players/forget", {trigger: true}); 
  }, 

  hideError: function () { this.$(".error").hide(); },
  displayError: function (msg) {
    this.$(".error").html(msg).show();
  },

  connexion : function(event) {
    if (this.status.current === this.status.UNREGISTERED)
      return this.checkEmail();
    if (this.status.current === this.status.LOGIN)
      return this.login();
    if (this.status.current === this.status.REGISTERING)
      return this.register();
    assert(false);
    return;
  },

  deconnexion: function (event) {
    // on repasse par un player temporaire / anonyme ?
    var that = this;
    Y.User.createPlayerAsync(function (err) {
        if (that.unloaded)
          return; // prevent errors.
        if (err)
          return that.displayError(i18n.t("message.error_deconnexion"));
        that.hideError();
        that.updateStatus(that.status.UNREGISTERED);
    });
  },

  checkingEmail: false,
  checkEmail: function () {
    if (this.checkingEmail)
      return;
    // security.
    var email = $('#email').val().trim();
    if (!email.isEmail())
      return this.displayError(i18n.t("message.bad_mail"));
    //
    var that = this;
    this.checkingEmail = true;
    Backbone.ajax({
      dataType: 'json',
      url: Y.Conf.get('api.url.auth.registered'),
      type: 'GET',
      data: {
        // auth
        playerid: this.player.get('id'),
        token: this.player.get('token'),
        // email param
        email: email
      },
      success: function (result) {
        if (that.unloaded)
          return; // prevent errors.
        that.checkingEmail = false;
        that.hideError();
        if (result.registered) {
          that.updateStatus(that.status.LOGIN);
        } else {
          that.updateStatus(that.status.REGISTERING);
        }
      },
      error: function () {
        if (that.unloaded)
          return; // prevent errors.
        that.displayError(i18n.t("message.error"));
        that.checkingEmail = false;
      }
    });
  },

  login: function () {
    var mail = $('#email').val().trim()
      , password = $('#password').val().trim()
      , that = this;

	  Backbone.ajax({
      dataType: 'json',
      url: Y.Conf.get("api.url.auth"),
      type: 'POST',
      data: {
        email: { address: mail },
        uncryptedPassword: password
      },
      success: function (result) {
		    var player = new PlayerModel(result);	
		    Y.User.setPlayer(player);
        if (that.unloaded)
          return; // prevent errors.
        that.hideError();
      	that.updateStatus(that.status.REGISTERED);
      },
      error: function (err) {
        if (that.unloaded)
          return; // prevent errors.
		    that.displayError(i18n.t('message.signinerror'));
      }
    });
    return this;
  },

  checkPassword : function (input) {
    var ck_password =  /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
    if (!ck_password.test(input)) 
	    return true;
    return false;
  },

  register: function () {
    var email = $('#email').val().trim()
      , password = $('#password').val().trim()
      , passwordConfirm = $('#password_confirm').val().trim();

    if (!email.isEmail())
      return this.displayError(i18n.t("message.bad_mail"));
    if (this.checkPassword(password))
      return this.displayError(i18n.t("message.bad_password"));
    if (password !== passwordConfirm)
      return this.displayError(i18n.t("message.password_mismatch"));
    //
    this.hideError();
    //
    var that = this;
    var player = Y.User.getPlayer();
    player.set('email', email);
    player.set('uncryptedPassword', password);
    player.save().done(function (result) {
		  Y.User.setPlayer(new PlayerModel(result));
      that.updateStatus(that.status.REGISTERED);
    }).fail(function () {
      that.displayError(i18n.t("message.registering_error"));
    });;
  },
  
  // render the content into div of view
  render : function() {
    this.$el.html(this.playerSigninTemplate({}));
    this.updateStatus(this.status.current);
    this.$el.i18n();
    return this;
  },

  updateStatus: function (newStatus) {
    // handling status
    this.status.current = newStatus;
    this.$(".container").removeClass(_.values(this.status).join(" "));
    this.$(".container").addClass(this.status.current);
  },

  onClose : function() {
    this.undelegateEvents();
  }
});
