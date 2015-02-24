/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {


  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  // .writeHead()Content-Type writes to the request line and headers of the response,
  // which includes the status and all headers.
  var pathname = require('url').parse(request.url).pathname;
  var chatterboxPath = '/classes/chatterbox/';
  var testingPath = '/classes/messages';
  var testingPath2 = '/classes/room1';

  console.log(pathname);
  if (pathname === chatterboxPath){
    chatterboxHandler(request, response);
  } else if (pathname === testingPath){
    console.log('in test for log');
    logHandler(request, response);
  } else if (pathname ===testingPath2){
    console.log('in test for log2');
    logHandler(request, response);
  } else {
    response.writeHead(statusCode.notFound, headers);
    response.end();
  }


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

var chatterboxHandler = function (request, response) {
  if (request.method === "GET") {
    getMessages(request, response);
  } else if (request.method === "POST") {
    postMessage(request, response);
  } else if (request.method === "OPTIONS") {
    sendOptions(request, response, "GET, POST");
  }
};

var logHandler = function(request, response){
  if (request.method === "GET") {
    getMessages(request, response);
  } else if (request.method === "POST") {
    postMessage(request, response);
  } else if (request.method === "OPTIONS") {
    sendOptions(request, response, "GET, POST");
  }
}


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var getMessages = function(request, response) {
  headers['Content-Type'] = "application/json";
  response.writeHead(statusCode.ok, headers);
  response.end(JSON.stringify({results: storage}));
}

var postMessage = function(request, response){
  headers['Content-Type'] = "application/json";
  response.writeHead(statusCode.created, headers);
  request.on('data', function(data) {
    data = JSON.parse(data);
    var newMessage = {
      objectId: getID(),
      username: data.username,
      roomname: data.roomname,
      text: data.text,
      message: data.message,
      createdAt: new Date()
    };
    storage.push(newMessage);
    response.end(JSON.stringify({results: [newMessage]}));
  });
}
var sendOptions = function(request, response, options){
  headers['Allow'] = options + ", OPTIONS";
  response.writeHead(statusCode.ok, headers);
  response.end();
}
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var objectId = 0;
var storage = [];
var getID = function(){
  return ++objectId;
};

var statusCode = {
  'ok': 200,
  'notFound': 404,
  'created': 201,
  'unauthorized': 401
};

exports.requestHandler = requestHandler
