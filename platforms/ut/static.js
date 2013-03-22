// micro static server 
var express = require('express')
  , app = express();

app.configure(function() { app.use(express.static(__dirname + '/../../src/')) });
app.get('/kill', function () { process.exit(0) });

// reading .port file
var port = parseInt(process.env.YESWESCORE_UT_PORT, 10) || "4000";
console.log('static server spawned on *:' + port);
app.listen(port);