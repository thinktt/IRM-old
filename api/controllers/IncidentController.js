/**
 * IncidentController
 *
 * @description :: Server-side logic for managing incidents
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	// find: function (req, res){},
	// findOne: function (req, res){},
	// create: function (req, res){},
	// update: function (req, res){},
	// destroy: function (req, res){}

	show: function (req, res) {
		var id = req.param('id');

		Incident
		.findOne({id: id})
		.populate('reportedBy', {select: ['name', 'id']})
		.then(function(incident) {
			if(_.isEmpty(incident)) {
				return res.notFound('Could not find record.'); 
			} else {
				//strip out exess user data and password info!!
				incident.reportedBy = _.pick(incident.reportedBy, ['username','id']);
				return res.send(incident);
			} 
		})
		.catch(function(err){
			res.negotiate(err); 
		});
	}


};

