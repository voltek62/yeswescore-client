Y.Views.Navbar = Y.View.extend({
  el: "#navbar",

  events: {
    'click a[href="#games/list"]': "goToGames",
    'click a[href="#games/add"]': "goToGamesAdd",
    'click a[href="#account"]': "goToAccount"
  },

  initialize: function () {
    var that = this;
    Y.Router.on("pageChanged", function (page, fragment) {
      //console.log("fragment",fragment);
      this.highlight(fragment);
    }, this);
  },
  render: function () { },
  
  highlight: function (fragment) {
    // factorizing fragment.
    if (fragment == "index" || fragment.startsWith("games/comment/")) {
      fragment = "#";
    } else if ( fragment == "games/list" || fragment == "games" ) {
      fragment = "#games/list";
    } else if (fragment == "games/add") {
      fragment = "#games/add";
    } else if (fragment == "account") {
      fragment = "#account"
    } else {
      fragment = null; // unknown
    }

    // fragment was identified.
    if (fragment) {
      this.$("a").each(function () { $(this).removeClass("highlighted") });
      this.$('a[href="'+fragment+'"]').addClass("highlighted");
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

  goToGames: function () { console.log('goToGames'); Y.Router.navigate("", {trigger: true}); },
  goToGamesAdd: function () { console.log('goToGamesAdd'); Y.Router.navigate("games/add", {trigger: true}); },
  goToAccount: function () { console.log('goToAccount'); Y.Router.navigate("account", {trigger: true}); }
});