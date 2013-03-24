// we are in casperjs (phantomjs environment)
var casper = require('casper').create()
  , system = require('system');

var utPort = parseInt(system.env.YESWESCORE_UT_PORT, 10);
var fbPort = parseInt(system.env.YESWESCORE_FACEBOOK_PORT, 10);
var port = parseInt(system.env.YESWESCORE_PORT, 10);

var baseUrl = "http://localhost:"+utPort+"/";

casper.start(baseUrl, function() {
  // we are outside webkit.
  var UT = this.evaluateAsync(function (done) {
    // we are inside webkit.
    Y.ready(function () {
      done(Y.Conf.get('ut'));
    });
  }, function (doooh) {
    // we are back
    console.log("doooh="+doooh); // should be 42
  });

});

casper.then(function() {
  console.log('then');
});

casper.run(function() {
  this.echo('test');
});