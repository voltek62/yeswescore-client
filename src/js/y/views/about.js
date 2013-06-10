Y.Views.About = Y.View.extend({
  el: "#content",

  pageName: "about",
  pageHash : "about", 
  
  myinitialize: function () {
    Y.GUI.header.title(i18n.t('about.title'));
    this.aboutViewTemplate = Y.Templates.get('about');
    this.render();
  },

  render: function () {
	  $(this.el).html(this.aboutViewTemplate({version:Y.App.VERSION}));
    this.$(".about").i18n();
  }
});