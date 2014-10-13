var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var server = http.createServer(app);
var server, secureServer, sslOptions;
var io = require('socket.io');
var fs = require('fs');


var sslOptions = {
  key: fs.readFileSync('../cert/server.key'),
  cert: fs.readFileSync('../cert/server.crt'),
  ca: fs.readFileSync('../cert/ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
};


app.use('/', express.static('static/'));

server = http.createServer(app).listen(3000, function() {
  console.log('Server running on port 3000');
});

secureServer = https.createServer(sslOptions, app).listen(3443, function() {
  console.log('Secure server running on port 3443');
});



io = io.listen(secureServer);

io.on('connection', function (socket) {

  socket.broadcast.emit('user connected');

  socket.on('greeting', function (greeting, fn) {
    console.log(greeting);
    fn('Connection established!');
  });

  // socket.emit('greeting', { greeting: 'Howdy!' });
  // socket.on('reply', function (data) {
  //   console.log('client says ' + data.reply);
  // });

});




// var server = require('http').Server(app);
// var io = require('socket.io')(server);
// server.listen(3000);




// var express = require('express'),
//     app = express(),
//     io = require('socket.io'),
//     morgan = require('morgan'),
//     bodyParser = require('body-parser'),
//     https = require('https'),
//     http = require('http'),
//     fs = require('fs'),
//     port = Number(process.env.PORT || 3000),
//     securePort = Number(process.env.SECURE_PORT || 3443),
//     env = process.env.NODE_ENV || 'development',
//     server
//     ; 

// //.............Express Stack.....................
// //app.use(morgan('dev'));
// //app.use(bodyParser.json());
// app.use('/', express.static('static/'));
/*
http.createServer(app).listen(port, function() {
    console.log('Unsecured connection on port ' + port); 
});

console.log('Running in eviroment '+ env);

*/

/*  


//if this is heroku turn on trust proxy for https forwarding 
//otherwise start up the node ssl server
if(env === 'heroku') {
  app.enable('trust proxy'); 
} else {
  https.createServer(sslOptions, app).listen(securePort, function(){
    console.log('Secured connection on port ' + securePort);
  });
}


      sslOptions = {
      key: fs.readFileSync('../cert/server.key'),
      cert: fs.readFileSync('../cert/server.crt'),
      ca: fs.readFileSync('../cert/ca.crt'),
      requestCert: true,
      rejectUnauthorized: false
    };

    sessionOptions = {
      key: 'session',
      secret: secret,
      cookie: {secure: true, httpOnly: true},
      store: sessionStore,
      saveUninitialized: true,
      resave: true
    };
*/