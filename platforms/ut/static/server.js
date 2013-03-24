// micro static server 
var express = require('express')
  , fs = require('fs')
  , app = express();

var utPort = parseInt(process.env.YESWESCORE_UT_PORT, 10);
var fbPort = parseInt(process.env.YESWESCORE_FACEBOOK_PORT, 10);
var port = parseInt(process.env.YESWESCORE_PORT, 10);
  
app.configure(function() {
  app.use(express.logger());
  app.use(express.static(__dirname + '/../../../src/'))
});
app.get('/ut.js', function (req, res) {
  fs.readFile(__dirname + '/ut.js', 'utf8', function (err, data) {
    if (err) {
      return res.end('');
    }
    // replacing values.
    data = data.replace(/[API_BASE_URL]/g, '"http://plic.no-ip.org:' + utPort + '"')
               .replace(/[FB_BASE_URL]/g, '"http://plic.no-ip.org:' + fbPort + '"');
    res.end(data);
  });
});
app.get('/kill', function () { process.exit(0) });

// reading .port file
console.log('static server spawned on *:' + utPort);
app.listen(utPort);