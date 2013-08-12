Y.Views.Navbar = Y.View.extend({
  el: "#navbar",

  events: {
    'vclick a[data-fragment="games/list"]': "goToGames",
    'vclick a[data-fragment="games/add"]': "goToGamesAdd",
    'vclick a[data-fragment="account"]': "goToAccount"
  },

  initialize: function () {
    var that = this;
    Y.Router.on("pageChanged", function (page, fragment) {
      this.highlight(fragment);
    }, this);
  },
  render: function () { },
  
  highlight: function (fragment) {
    // factorizing fragment.
    if ( fragment == "games/list" || fragment == "games" ) {
      fragment = "games/list";
    } else if (fragment == "games/add") {
      fragment = "games/add";
    } else if (fragment == "account") {
      fragment = "account"
    } else {
      fragment = null; // unknown
    }

    // fragment was identified.
    if (fragment) {
      this.$("a").each(function () { $(this).removeClass("highlighted") });
      this.$('a[data-fragment="'+fragment+'"]').addClass("highlighted");
    }
  },

  show: function () { 
	  this.$el.show();
  },

  hide: function () { 
      /*
      this.$el.css("opacity", 0)
	  #navbar { transition: opacity ease 1s; }
      */
	  this.$el.hide();
  },

  goToGames: function () { Y.Router.navigate("games/list", {trigger: true}); },
  goToGamesAdd: function () { Y.Router.navigate("games/add", {trigger: true}); },
  goToAccount: function () { Y.Router.navigate("account", {trigger: true}); }
});