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

  afterValidate: function(values, cb) {
    User.findOne({username: values.username}).exec(function(err, record) {
      if (record) { 
        err = {error: 'username in use'}; 
        cb(err);
      }
      cb();
    });
  }


};

