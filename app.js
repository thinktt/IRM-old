var express = require('express'),
    mongoose = require('mongoose'), 
    app = express(),
    https = require('https'),
    http = require('http'),
    fs = require('fs'),
    auth = require('auth')(mongoose),
    port = Number(process.env.PORT || 3000),
    securePort = Number(process.env.SECURE_PORT || 3443),
    mongoUri = process.env.MONGO_URI || 'mongodb://localhost/devdb',
    secret = process.env.SESSION_SECRET || 'non-secret secret for dev only',
    env = process.env.NODE_ENV || 'development',
    db, mongoTest, sessionOptions, requireHttps, sslOptions, httpsRedirect
    ; 

    sslOptions = {
      key: fs.readFileSync('../cert/server.key'),
      cert: fs.readFileSync('../cert/server.crt'),
      ca: fs.readFileSync('../cert/ca.crt'),
      requestCert: true,
      rejectUnauthorized: false
    };


//...........MongoDB Connection.....................
mongoose.connect(mongoUri, function (){
    console.log('Connected to databse at ' + mongoUri);
});
db = mongoose.connection;
db.on('error', function () {
  console.log('unable to connect to database at ' + mongoUri);
});


httpsRedirect = function (req, res, next) {
  var host = req.host; 
  if(!req.secure) {
     return res.redirect('https://'+ host + ':' + securePort);
   }  
   return next();
};


//.............Express Stack.....................
app.use(express.logger('dev'));
app.use(httpsRedirect);

app.use(require('express-session')({
    key: 'session',
    secret: secret,
    cookie: {secure: true, httpOnly: true},
    store: require('mongoose-session')(mongoose),
    saveUninitialized: true,
    resave: true
}));

app.use('/login', express.static('login/'));
app.post('/login', auth.handlePost());
app.use('/', express.static('static/'));



//..........Start Up Servers..........................
//if this is heroku turn on trust proxy for https forwarding 
//otherwise start up the node ssl server
if(env === 'heroku') {
  app.enable('trust proxy'); 
} else {
  https.createServer(sslOptions, app).listen(securePort, function(){
    console.log('Secured connection on port ' + securePort);
  });
}

http.createServer(app).listen(port, function() {
    console.log('Unsecured connection on port ' + port); 
});

console.log('Running in eviroment '+ env);
console.log('Session secret is "' + secret + '"');
