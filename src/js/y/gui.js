(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var GUI = {
    header: null,       // singleton view #header
    content: null,      // singleton current view (center)
    autocomplete: null, // singleton view #autocomplete
    navbar: null,       // singleton view #navbar
    inputMode: function (status) {
      if (window.isMobileBrowser()) { // only on mobile browser
        var $body = $("body");
        if (status) {
          $body.addClass("inputmodeon");
          $body.removeClass("inputmodeoff");
        } else {
          $body.removeClass("inputmodeon");
          $body.addClass("inputmodeoff");
        }
      }
      return true;
    },

    // display an overlay asking the user to upgrade
    // FIXME: HTML should be in the .html / or in index.html
    displayNewVersionLayer: function () {
      $('body').addClass('update'); // we don't need the overlay.
      $('body').html('Veuillez mettre &agrave; jour l\'application pour continuer &agrave; l\'utiliser');
    },

    displayErrorLayer: function () {
      $('#content').html('<span style="color:black;font-size:25px;top:80px;position:absolute;">Une erreur s\'est produite lors du lancement de l\'application</span>');
    }
  };

  Y.Connection.on("change", function (state) {
      if (state[0] === Y.Connection.STATUS_ONLINE) {
      	$('body').removeClass("offline");   
      } else {
      	$('body').addClass("offline"); 
      }
  });

  Y.GUI = GUI;
})(Y);