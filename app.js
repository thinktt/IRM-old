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

  socket.on('incident', function (incident) {
    var newIncident;
    console.log(incident.date);
    
    newIncident = Incident(incident);
    newIncident.save(function (err, incident) {
      if(!err) {
        console.log(incident._id);
      }
    });
  });

  // socket.emit('greeting', { greeting: 'Howdy!' });
  // socket.on('reply', function (data) {
  //   console.log('client says ' + data.reply);
  // });

});

//.........Incident Mongoodse Model.............


  var incidentSchema = mongoose.Schema({  
      reportedBy: String, //"Tobias",
      userID: String, //"thinktt",
      date: String, //(moment(new Date()).format('YYYY-MM-DD')),
      time: String, // (moment(new Date()).format('HH:mm')),
      studentWorker: String, //name,
      schedulerID: String, //ID,
      fromLab: String, //'BLOC',
      fullID: String, //'BLOC-' + ID, //fromLab-schedulerID
      lab: String, //'BLOC', //SCC, Pool, WCL
      station: String, //'Print Room', 
      shiftStart: String, //(moment(new Date()).format('HH:00')),
      shiftArrive: String, //(moment(new Date()).format('HH:30')),
      arrivalStatus: String, //'pending', //missed, pending
      type: String, //'Absent', //Tardy, Absent
      openStatus: String, //'Submitted', //Open, Submitted
      sentEmail: String, //'no', //no, yes
      called: String, //'no', //no, yes
      reason: String, //'none',
      summary: String, //'',
      comments: [{
        by: String, //'Tobias',
        date: String, // '2014-09-07',
        time: String, // '15:00',
        subject: String, // 'Initial Comment',
        body: String, //'He showed up 20 minutes late. He said he missed the bus. He called when he was on his way.',
        new: Boolean
      }],
      emailLogs: [],
      status: String, //'Pending Review', //Pending Review, Unexcused, Excused
      meetingDate: String, //'Pending', //if not pending date goes here
  });

var Incident = mongoose.model('Incident', incidentSchema); 








//var User = mongoose.model('User', userSchema); 
// var commentSchema = mongoose.Schema({
//     by: String, //'Tobias',
//     date: String, // '2014-09-07',
//     time: String, // '15:00',
//     subject: String, // 'Initial Comment',
//     body: String, //'He showed up 20 minutes late. He said he missed the bus. He called when he was on his way.',
//     new: Boolean
//   });