var express = require("express");
var app = express();

var MongoClient = require('mongodb').MongoClient;
var monUrl = 'mongodb://james:pass@ds059195.mongolab.com:59195/vote-app';

app.use('/public', express.static(__dirname + '/public'));

MongoClient.connect(monUrl, function(e, db) {
    if(e) { console.log("database did not connect"); return; }
    
    app.get('/', function(req, res) {
        res.sendFile(__dirname + "/public/index.html");
    });
    
    app.listen(process.env.PORT || 8080);
});





