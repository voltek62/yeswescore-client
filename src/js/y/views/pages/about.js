Y.Views.Pages.About = Y.View.extend({
  el: "#content",

  pageName: "about",
  pageHash : "about", 
  
  myinitialize: function () {
    Y.GUI.header.title(i18n.t('about.title'));
    this.page = Y.Templates.get('page-about');
    this.render();
  },

  render: function () {
	  $(this.el).html(this.page({versionapp:Y.App.VERSION}));
    this.$(".about").i18n();
  }
});