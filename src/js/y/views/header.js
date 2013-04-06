Y.Views.Header = Backbone.View.extend({
  el: "#header",

  events: {
    "click .backButton": "goBack"
  },

  initialize: function () {
    this.startingLength = window.history.length;

    // on s'abonne au router, pour detecter des changement de pages.
    var that = this;
    Y.Router.on("pageChanged", function (a, b) {
      that.repaintBack();
    });

    // on s'abonne a la classe de connexion pour signifier les changements

  },
  render: function () { },

  // @param string title
  // @return void.
  title: function (title) { 
    if (typeof title === "string")
      this.$(".title").text(title);
  },

  goBack: function () {
    window.history.back();
  },

  showBack: function () { this.$(".backButton").show() },
  hideBack: function () { this.$(".backButton").hide() },
  repaintBack: function () {
    var pageName = Y.GUI.content.pageName;
    if (pageName == "index" ||
        pageName == "gameAdd" ||
        pageName == "account")
      this.hideBack();
    else
      this.showBack();
  },

  showConnected: function () { },
  hideConnected: function () { }
});