var express = require('express');
var app = express();
var url = require('url');
var cors = require('express-cors')
var bodyParser = require('body-parser')

var objectId = 0;
var storage = [];
var getID = function(){
  return ++objectId;
};

var chatterboxPath = '/classes/chatterbox/*';

app.use(chatterboxPath, bodyParser.json());

app.use(chatterboxPath, cors({
    allowedOrigins: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers: ['Content-Type', 'Accept'],
    maxAge: 10
}));

app.get(chatterboxPath, function (req, res) {
  res.send({results: storage});
});

// app.options(chatterboxPath, function(req, res) {

// });

app.post(chatterboxPath, function(req, res){

  var newMessage = {
    objectId: getID(),
    username: req.body.username,
    roomname: req.body.roomname,
    text: req.body.text,
    message: req.body.message,
    createdAt: new Date()
  };

  storage.push(newMessage);
  res.send({results: [newMessage]});
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
