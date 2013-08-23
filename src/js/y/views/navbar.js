Y.Views.Navbar = Y.View.extend({
  el: "#navbar",
  
  events: {
    'vclick a[data-fragment="follow"]': "displaySubBarFollow",    
    'vclick a[data-fragment="add"]'  : "displaySubBarAdd",
    
    'vclick #subnavbar div[data-fragment="player"]': "goToPlayer",
    'vclick #subnavbar div[data-fragment="team"]': "goToTeam",
    'vclick #subnavbar div[data-fragment="club"]': "goToClub",         
      
    'vclick a[data-fragment="account"]'   : "goToAccount"
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
    if ( fragment == "follow" || fragment == "games/list" || fragment == "teams/list" || fragment == "clubs/list" ) {
      fragment = "follow";
    } else if (fragment == "add" || fragment == "games/add" || fragment == "teams/add" || fragment == "clubs/add" ) {
      fragment = "add";
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


  displaySubBarFollow: function () { this.highlight("follow");$('#subnavbar').show(); },   
  displaySubBarAdd: function () { this.highlight("add");$('#subnavbar').show(); },  
  
  goToPlayer: function () { 
    console.log('goToPlayer');
    this.$('div[data-fragment="player"]').addClass("highlighted");
    Y.Router.navigate("games/list", {trigger: true}); 
  },
  goToTeam: function () { 
    console.log('goToTeam');  
    Y.Router.navigate("teams/list", {trigger: true}); 
  },
  goToClub: function () { 
    console.log('goToClub');  
    Y.Router.navigate("clubs/list", {trigger: true}); 
  },  
  
  goToAccount: function () { $('#subnavbar').hide();Y.Router.navigate("account", {trigger: true}); }
});