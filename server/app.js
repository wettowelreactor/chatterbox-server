var express = require('express');
var app = express();
var url = require('url');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('underscore');
var storage = [];
var objectId = 0;
var getID = function(){
  return ++objectId;
};

var readLog = function() {
  fs.readFile(__dirname + '/msglog.json', 'utf8', function (err, data) {
    if (err) throw err;
    console.log('read file', data);
    storage = JSON.parse(data);
  });
};

var writeLog = function() {
    fs.writeFile(__dirname + '/msglog.json', JSON.stringify(storage), function (err, data) {
    if (err) throw err;
    console.log('wrote file');
  });
};

var getMaxID = function () {
  var maxID = _.max(_.pluck(storage, 'objectId'));
  return maxID === -Infinity ? 0 : maxID;
};

readLog();
objectId = getMaxID();

var chatterboxPath = '/classes/chatterbox/*';
var liveServerPath = '/classes/messages/*';
var stubServerPath = '/classes/room1/*';

app.use('*', bodyParser.json());

app.use(cors());

app.use(express.static(__dirname + '/../client'));

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
  writeLog();
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
