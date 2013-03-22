var casper = require('casper').create();

var port = parseInt(process.env.YESWESCORE_UT_PORT, 10) || "4000";
casper.start('http://localhost:'