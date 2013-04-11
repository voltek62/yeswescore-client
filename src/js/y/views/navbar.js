Y.Views.Navbar = Backbone.View.extend({
  el: "#navbar",

  events: {
    'click a[href="#"]': "goToGames",
    'click a[href="#games/add"]': "goToGamesAdd",
    'click a[href="#account"]': "goToAccount"
  },

  initialize: function () {
    // nothing yet
  },
  render: function () { },
  
  show: function () { 
	this.el.show();
  },

  hide: function () { 
    /*
    this.$el.css("opacity", 0)
	#navbar { transition: opacity ease 1s; }
    */
	this.el.hide();
  },

  goToGames: function () { console.log('goToGames'); Y.Router.navigate("", {trigger: true}); },
  goToGamesAdd: function () { console.log('goToGamesAdd'); Y.Router.navigate("games/add", {trigger: true}); },
  goToAccount: function () { console.log('goToAccount'); Y.Router.navigate("account", {trigger: true}); }
});