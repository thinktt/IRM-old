var bcrypt = require('bcryptjs'),
    auth;

auth = function(mongoose) {
  //..................Define User Model..............
  var userSchema = mongoose.Schema({  
    username: {type: String, lowercase: true}, 
    passHash: String,
  });
  var User = mongoose.model('User', userSchema); 


  //..................Handle Login Post Request.................
  function handleLoginPost(req, res, next) {
    var username = req.body.username,
        password = req.body.password,
        usernameRegEx = /^[a-z0-9_-]{3,16}$/,
        passwordRegEx = /^[\u0020-\u007E]{8,256}$/,
        user;

    //validate post request
    if(req.body.postId === 'logIn' || 'register') {
      if(!usernameRegEx.test(username)) {
        res.send({reply: 'invalid post'});
      }
      if(!passwordRegEx.test(password)) {
        res.send({reply:'invalid post'}); 
      }
    } 
    else {
      res.send({reply:'invalid post'});
    }

    //if this is a logIn post request
    if(req.body.postId === 'logIn') {
      
      //look up user in database
      User.find({username: username}, function(error, userData) {
        //does the user exist
        if(userData.length === 0) {
          console.log('user not found');
          res.send('invalid login');
        }
        else {
          user = userData[0]; 
          //check the password 
          bcrypt.compare(password, user.passHash, function(err, hashRes) {
             if(hashRes === true) { 
                req.session.userStatus = 'loggedIn'; 
                req.session.user = username; 
                res.send('user validated');                
             } 
             else {
               console.log('invalid password');
               res.send('invalid login'); 
             }
          });
        }
      }); 
    }

    //if this is a registration post request
    if(req.body.postId === 'register') {
    
      //check if username exist
      User.find({username: username}, function(error, userData){
        
        //if it doesn't exist then add it           
        if(userData.length === 0) {
          user = new User(); 
          user.username = username;
          
          //generate a salt
          bcrypt.genSalt(10, function(err, salt) {

              //when salt is done hash the password
              bcrypt.hash(password, salt, function(err, hash) {
                  
                  //when hash is done store new credentials in db
                  user.passHash = hash; 
                  user.save(function (err) {
                    if(!err) {
                      res.send('user added');
                      return; 
                    }
                  });
              });
          });
        }
        //otherwise user already exist
        else {
          res.send('user taken');
          return; 
        }

      });

    }
  }

  return {
    handleLoginPost: handleLoginPost
  };
};


module.exports = auth;
