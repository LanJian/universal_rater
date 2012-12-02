var express = require('express');
var stylus = require('stylus');
var assets = require('connect-assets');
var redis = require('redis');

var app = express();
app.use(assets());

app.use(express.static(process.cwd() + '/public'));
app.use(express.static(process.cwd() + '/assets/script'));

app.set('view engine', 'jade');

app.db = redis.createClient();

app.get('/', function(req, resp) {
  app.db.set('mykey', 'myvalue', function(err, val) {
    return resp.render('index');
  });
});

app.get('/getval', function(req, resp) {
  app.db.get('mykey', function(err, val) {
    console.log('getval: ' + val);
    return resp.send(val);
  });
});

require('./entity')
require('app');

port = process.env.PORT || process.env.VMC_APP_PORT || 3000;

app.listen(port, function() {
  return console.log("Listening on " + port + "\nPress CTRL-C to stop server.");
});
