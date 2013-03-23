// we are in casperjs (phantomjs environment)
var casper = require('casper').create()
  , system = require('system');

var utPort = parseInt(system.env.YESWESCORE_UT_PORT, 10);
var fbPort = parseInt(system.env.YESWESCORE_FACEBOOK_PORT, 10);
var port = parseInt(system.env.YESWESCORE_PORT, 10);

var baseUrl = "http://localhost:"+utPort+"/";

casper.start(baseUrl, function() {
  console.log('started');
  var UT = this.evaluate(function () { return window.UT; });
  console.log("UT = " + UT);
});

casper.then(function() {
  console.log('then');
});

casper.run(function() {
  this.echo('test');
});