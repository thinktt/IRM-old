/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	signUp: function(req, res){
		var username = req.param('username');
		var password = req.param('password');
		var email = req.param('email');
		var encryptedPassword;
		
		require('machinepack-passwords').encryptPassword({
			password: password
		}).exec({
			
			error: function(err) {
				return res.negotiate(err);
			},
			
			success: function(encryptedPassword) {
				User.create({
					username: username,
					encryptedPassword: encryptedPassword,
					email: email
				}, function(err, newUser){
					if(err) return res.negotiate(err); 
					//user is created
					res.send(newUser);
				});
			}
		
		});
	}
};

