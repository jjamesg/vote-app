var express = require("express");
var app = express();
var bodyParser = require('body-parser');

var ServerController = require('./app/controllers/cont.server.js');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var monUrl = 'mongodb://james:pass@ds059195.mongolab.com:59195/vote-app';

app.use('/public', express.static(__dirname + '/public'));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

MongoClient.connect(monUrl, function(e, db) {
    if(e) { console.log("database did not connect"); return; }
    
    var serverController = new ServerController(db, ObjectId);
    
    app.get('/', function(req, res) {
        res.sendFile(__dirname + "/public/index.html");
    });
    
    app.post('/poll', serverController.handleNewPoll);
    
    app.post('/poll/p', serverController.handleVote);
    
    app.get('/poll/p/:id', serverController.getPoll);
    
    app.get('/poll/*', function(req, res) {
        res.sendFile(__dirname + "/public/poll.html");
    });
    

    app.listen(process.env.PORT || 8080);
});





