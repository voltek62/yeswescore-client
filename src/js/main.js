// MAIN ENTRY POINT
$(document).ready(function () {
  // Document is ready => initializing YesWeScore
  Y.ready(function () {
    // YesWeScore is ready.
    /*#ifdef DEV*/
    console.log('YesWeScore is ready.');
    /*#endif*/
  });

  Cordova.ready(function () {
    // Cordova is ready
    /*#ifdef DEV*/
    console.log('Cordova is ready.');
    /*#endif*/
  });
});

