Y.Views.Pages.Add = Y.View.extend({
  el: "#content",

  pageName: "add",
  pageHash : "add", 
  
  myinitialize: function () {
    Y.GUI.header.title(i18n.t('add.title'));
    this.page = Y.Templates.get('page-add');
    this.render();
  },

  render: function () {
    $(this.el).html(this.page({}));
    $('a').i18n();
  }
});