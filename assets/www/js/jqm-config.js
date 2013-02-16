$(document).bind("mobileinit", function() {
  $.mobile.ajaxEnabled = false;
  $.mobile.linkBindingEnabled = false;
  $.mobile.hashListeningEnabled = false;
  $.mobile.pushStateEnabled = false;
  $.mobile.allowCrossDomainPages = true;
  // DESACTIVATE INIT FOR DOM
  // $.mobile.autoInitializePage = false;

  // $.mobile.defaultPageTransition = 'none';
  // $.mobile.autoInitializePage = false;
  // $.mobile.touchOverflowEnabled = false;
  // $.mobile.defaultDialogTransition = 'none';
  // $.mobile.loadingMessage = 'Daten werden geladen...' ;
  // $.mobile.slideText:"none";
  // $.mobile.slideUpText:"none";

  $.extend($.mobile, {
    // autoInitializePage : false,
    touchOverflowEnabled : false,
    slideText : "none",
    slideUpText : "none",
    defaultPageTransition : "none",
    defaultDialogTransition : "none"
  });

  // Remove page from DOM when it's being replaced
  // $('div[data-role="page"]').live('pagehide', function (event, ui) {
  // $(event.currentTarget).remove();
  // });
});
