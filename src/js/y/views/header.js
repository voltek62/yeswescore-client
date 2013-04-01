Y.Views.Header = Backbone.View.extend({
  el: "#header",

  initialize: function () {
    // on s'abonne au router, pour detecter des changement de pages.
    Y.Router.on("pageChanged", function () {
      // gestion du bouton back / prev.
      
    });

    // on s'abonne a la classe de connexion pour signifier les changements

  },
  render: function () { },

  showBack: function () { },
  hideBack: function () { },

  showConnected: function () { },
  hideConnected: function () { }
});