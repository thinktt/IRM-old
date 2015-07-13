/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


var uniqueUsername = false;
var uniqueEmail = false; 


module.exports = {

	schema: true,

  //custom validation types
  types: {
    usernameNotInDB: function(value) {
      return uniqueUsername;
    },
    emailNotInDB: function(value) {
      return uniqueEmail;
    }
  },

  attributes: {

  	username: {
  		type: 'string',
  		lowercase: true,
  		required: true,
  		minLength: 3,
  		maxLength: 16,
  		unique: true,
      usernameNotInDB: true,
  		regex: /^[a-z0-9_-]{3,16}$/

  	},

  	encryptedPassword: {
  		type: 'string',
  		required: true
  	},

  	email: {
  		type: 'email',
      required: true,
  		lowercase: true,
  		unique: true,
      emailNotInDB: true
   	}


  },

  // lifecycle callback that checks to make sure the new users username 
  // and email are not arlready in the database
  beforeValidate: function(newUser, cb) {
    // search for a duplicate username or a duplicate email in the DB
    User.findOne({username: newUser.username})
    .then(function(usernameQuery){
      var emailQuery = User.findOne({email: newUser.email});
      return [usernameQuery, emailQuery];
    })
    //collect the query returns, if no users exist with this email
    //or username take note by marking the validator flags
    .spread(function(userWithUsername, userWithEmail){
      
      if(userWithUsername) uniqueUsername = false;
      else uniqueUsername = true;
      
      if(userWithEmail) uniqueEmail = false;
      else uniqueEmail = true;

      //continue to model validation
      return cb();
    })
    .catch(function(err){
      cb(err);
    });

  }

};
    