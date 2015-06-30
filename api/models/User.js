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
      //return false; 
      return uniqueUsername;
    },
    emailNotInDB: function(value) {
      //return false; 
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
  		type: 'string',
      required: true,
  		lowercase: true,
  		email: true,
  		unique: true,
      emailNotInDB: true,
   	}
  },

  // lifecycle callback that checks to make sure the new users username 
  // and email are not arlready in the database
  beforeValidate: function(newUser, cb) {
    // search for a duplicate username or a duplicate email
    User.findOne({
      or: [
        {username: newUser.username},
        {email: newUser.email}
      ]
    })
    .exec(function(err, user) {

      //if there was an error in the search return it
      if(err) return cb(err);
      
      //if there is a matching username or email take note 
      if(user) {
        uniqueUsername = user.username !== newUser.username; 
        uniqueEmail = user.email !== newUser.email; 

      //if no user was found at all then all fields are go
      } else {
        uniqueUsername = true; 
        uniqueEmail = true; 
      }
      
      //continue to validatoins
      return cb();
    });
 
  }

};

   