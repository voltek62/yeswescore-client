Y.Views.Header = Backbone.View.extend({
  el: "#header",

  events: {
    "click .backButton": "goBack"
  },

  initialize: function () {
    console.log('starting Length : ' + window.history.length);
    this.startingLength = window.history.length;

    // on s'abonne au router, pour detecter des changement de pages.
    var that = this;
    Y.Router.on("pageChanged", function (a, b) {
      console.log('pageChanged ' + a + " " + b);
      that.repaintBack();
      // gestion du bouton back / prev.
      /*
      FIXME: comment gérer correctement l'historique ...

      console.log('HEADER: history length ' + window.history.length);
      if (window.history.length > 0)
        document.querySelector("#header .backButton").style.display = "block";
      else
        document.querySelector("#header .backButton").style.display = "none";
      */
    });

    /*document.addEventListener("backbutton", function () {
      console.log('BACK BUTTON PRESSED');
    }, false);*/

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

  showBack: function () { this.$(".backButton").css("opacity", 1) },
  hideBack: function () { this.$(".backButton").css("opacity", 0) },
  repaintBack: function () {
    console.log('history length : ' + window.history.length);

    //if (window.history.length > this.startingLength)
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