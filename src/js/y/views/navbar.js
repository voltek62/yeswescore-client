Y.Views.Navbar = Backbone.View.extend({
  el: "#navbar",

  events: {
    'click #navbar a[href="#"]': "goToGames",
    'click #navbar a[href="#games/add"]': "goToGamesAdd",
    'click #navbar a[href="#account"]': "goToAccount"
  },

  initialize: function () {
    // nothing yet
  },
  render: function () { },

  goToGames: function () { console.log('goToGames'); Y.Router.navigate("", {trigger: true}); },
  goToGamesAdd: function () { console.log('goToGamesAdd'); Y.Router.navigate("games/add", {trigger: true}); },
  goToAccount: function () { console.log('goToAccount'); Y.Router.navigate("account", {trigger: true}); }
});