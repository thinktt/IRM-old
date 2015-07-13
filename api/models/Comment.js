/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	by: {
  		model: 'user' //User ID
  	},

  	date: {
  		type: 'date' 
  	},
 		
 		time: {
 			type: 'time'
 		},

 		subject: {
 			type: 'string'
 		},

 		body: {
 			type: 'string'
 		}

  }
};

