// micro static server 
var express = require('express')
  , fs = require('fs')
  , app = express();

app.configure(function() {
  app.use(express.logger());
  app.use(express.static(__dirname + '/../../../src/'))
});
app.get('/ut.js', function (req, res) {
  fs.readFile(__dirname + '/ut.js', 'utf8', function (err, data) {
    if (err) {
      return res.end('');
    }
    res.end(data);
  });
});
app.get('/kill', function () { process.exit(0) });

// reading .port file
var port = parseInt(process.env.YESWESCORE_UT_PORT, 10) || "4000";
console.log('static server spawned on *:' + port);
app.listen(port);