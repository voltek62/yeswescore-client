Y.Views.Pages.Help = Y.View.extend({
  el: "#content",

  pageName: "help",
  pageHash : "help", 

  events: {
    "click .button[data-wizard-step]": "toWizard"
  },
  
  myinitialize: function () {
    Y.GUI.header.title(i18n.t('help.title'));
    this.page = Y.Templates.get('page-help');
    this.render();
  },

  toWizard: function (ev) {
    var stepId = $(ev.currentTarget).attr("data-wizard-step");
    Y.GUI.wizard.startAt(stepId);
  },

  render: function () {
    $(this.el).html(this.page()).i18n();
  }
});