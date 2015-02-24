var express = require('express');
var app = express();
var url = require('url');
var cors = require('cors')
var bodyParser = require('body-parser')

var objectId = 0;
var storage = [];
var getID = function(){
  return ++objectId;
};

var chatterboxPath = '/classes/chatterbox/*';
var liveServerPath = '/classes/messages/*';
var stubServerPath = '/classes/room1/*';

app.use('*', bodyParser.json());

app.use(cors());

var handleGet = function(req, res){
  res.send({results: storage});
};

app.get(chatterboxPath, handleGet);
app.get(liveServerPath, handleGet);
app.get(stubServerPath, handleGet);

var handlePost = function(req, res){
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
};

app.post(chatterboxPath, handlePost);
app.post(liveServerPath, handlePost);
app.post(stubServerPath, handlePost);

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
