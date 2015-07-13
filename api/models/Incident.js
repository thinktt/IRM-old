/**
* Incident.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	schema: true,

  attributes: {
  
  	reportedBy: {
  		model: 'user',
  		required: true
  	},

  	date: {
  		type: 'date'
  	},

  	time:  {
  		type: 'time'
  	},

  	worker: {
  		type: 'string'
  	},

  	workerID : {
  		type: 'string'
  	},

  	fromLab: {
  		type: 'string'
  	},

  	station: {
  		type: 'string'
  	},

  	shiftStart: {
  		type: 'string'
  	},

  	shiftArrive: {
  		type: 'string'
  	},

  	arrivalStatus: {
  		type: 'string'
  	},

  	type: {
  		type: 'string'
  	},

  	openStatus: {
  		type: 'string'
  	},

  	emailSent: {
  		type: 'string'
  	},

  	called: {
  		type: 'string'
  	},

  	reason: {
  		type: 'string'
  	},

  	status: {
  		type: 'string'
  	},

  	metingDate: {
  		type: 'string'
  	},

  }
};

