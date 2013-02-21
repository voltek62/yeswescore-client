// MAIN ENTRY POINT
$(document).ready(function () {
  // Document is ready => initializing YesWeScore
  Y.ready(function () {
    // YesWeScore is ready.
    console.log('YesWeScore is ready.');
  });

  Cordova.ready(function () {
    // Cordova is ready
    console.log('Cordova is ready.')
  });
});