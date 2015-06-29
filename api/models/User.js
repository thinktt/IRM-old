/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	schema: true,

  attributes: {

  	username: {
  		type: 'string',
  		lowercase: true,
  		required: true,
  		minLength: 3,
  		maxLength: 16,
  		unique: true,
  		regex: /^[a-z0-9_-]{3,16}$/

  	},

  	encryptedPassword: {
  		type: 'string',
  		required: true
  	},

  	email: {
  		type: 'string',
  		lowercase: true,
  		email: true,
  		unique: true
  	}
  },

  //lifecycle callback that checks to make sure the new user username 
  //and email are not arlready in the database.
  afterValidate: function(newUser, cb) {
    User.findOne({
      or: [
        {username: newUser.username},
        {email: newUser.email}
      ]
    })
    .then(function(user) {
      var err;
      if(user && user.username === newUser.username) {
        err = {error: "Username already in use", status: 400};
        return cb(err); 
      } else if(user && user.email === newUser.email) {
        err = {error: "Email already in use", status: 400};
        return cb(err); 
      } else {
        return cb(); 
      }
          
    })
    .catch(function(err) {
      cb(err);
    });

  }

};

   