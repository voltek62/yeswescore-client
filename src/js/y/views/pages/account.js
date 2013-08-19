Y.Views.Pages.Account = Y.View.extend({
  el: "#content",

  pageName: "account",
  pageHash : "account", 
  
  myinitialize: function () {
    Y.GUI.header.title(i18n.t('account.title'));
    this.page = Y.Templates.get('page-account');
    this.clubid = Y.User.getClub();
    this.player = Y.User.getPlayer()
    this.render();
  },

  render: function () {
    $(this.el).html(this.page({player: this.player, clubid: this.clubid}));
    $('a').i18n();
    // is the wizard disabled ?
    if (Y.GUI.wizard.isDisabled()) {
      $('a[href="#help"]').hide();
    }
  }
});