var express = require('express'),
    morgan = require('morgan'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    sessionStore = require('mongoose-session')(mongoose), 
    app = express(),
    io = require('socket.io'),
    https = require('https'),
    http = require('http'),
    fs = require('fs'),
    auth = require('./auth.js')(mongoose),
    port = Number(process.env.PORT || 3000),
    securePort = Number(process.env.SECURE_PORT || 3443),
    mongoUri = process.env.MONGO_URI || 'mongodb://localhost/devdb',
    secret = process.env.SESSION_SECRET || 'non-secret secret for dev only',
    env = process.env.NODE_ENV || 'development',
    db, sessionOptions,  sslOptions, httpsRedirect, requireAuth,
    server, secureServer
    ; 

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

//...........MongoDB Connection.....................
mongoose.connect(mongoUri, function (){
    console.log('Connected to databse at ' + mongoUri);
});
db = mongoose.connection;
db.on('error', function () {
  console.log('unable to connect to database at ' + mongoUri);
});


//...........Route Controllers......................
httpsRedirect = function (req, res, next) {
  var host = req.host; 
  if(!req.secure) {
     return res.redirect('https://'+ host + ':' + securePort);
   }  
   return next();
};

requireAuth = function (req, res, next) {
  var host = req.host;
  //avoid undefined user status
  req.session.userStatus = req.session.userStatus || 'loggedOut'; 
  //if cookies session id is not valid redirect to login page
  if( req.session.userStatus !== 'loggedIn') { 
     return res.redirect('https://' + host  + ':' + securePort +  '/login');
  }
  next(); 
};

//.............Express Stack.....................
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(httpsRedirect);
app.use(require('express-session')(sessionOptions));
app.use(favicon('static/favicons/irm.ico'));

//routes
app.post('/login', auth.handleLoginPost);
app.use('/', express.static('static/'));
app.use('/login', express.static('login/'));
//app.use(requireAuth);



//..........Start Up Servers..........................
server = http.createServer(app).listen(port, function() {
    console.log('Unsecured connection on port ' + port); 
});

//if this is heroku turn on trust proxy for https forwarding 
//otherwise start up the node ssl server
if(env === 'heroku') {
  app.enable('trust proxy');
  //run sockets on regular server through trust proxy
  io = io.listen(server);
} else {
  secureServer = 
    https.createServer(sslOptions, app).listen(securePort,function(){
      console.log('Secured connection on port ' + securePort);
  });
  //run sockets on secureServer  
  io = io.listen(secureServer);
}

console.log('Running in eviroment '+ env);
console.log('Session secret is "' + secret + '"');


//............Set Up Sockets...............................
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
