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

    Backbone.on("request.start", function () { that.animateConnection("on"); });
    Backbone.on("request.end", function () { that.animateConnection("off"); });

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
    console.log("Y.Views.Header: goBack()");
    window.history.go(-1);
    return false;
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

  connectionStatus: (function () {
    var status = "connected";
    return function (newStatus) {
      // FIXME: repaint GUI depending on newStatus.
      return status;
    };
  })(),

  animateConnection: (function () {
    // private vars
    var i = 0;
    var intervalId = null;
    var animationImages = [
      //"images/header-logo-on-animate-1.png",
      //"images/header-logo-on-animate-2.png",
      "images/pixel.png",
      "images/header-logo-on-animate-3.png",
      "images/header-logo-on-animate-4.png",
      "images/header-logo-on.png"
    ];
    var animationIndex = 0;
    //
    return function (status) {
      var connectionStatus = this.$(".connectionStatus");
      // animation repaint 
      var repaint = function () {
        var animationImage = animationImages[animationIndex % animationImages.length];
        connectionStatus.attr("src", animationImage);
        animationIndex++;
        if (animationIndex % animationImages.length == 0 && i == 0) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      };
      // handling "on" / "off"
      if (status == "on") {
        // on
        if (i == 0) {
          intervalId = window.setInterval(repaint, 100);
          repaint();
        }
        i++;
      } else {
        // off
        i--;
      }
    };
  })()
});