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
	},

	signIn: function(req, res) {
		var username = req.param('username');
		var password = req.param('password');

		User.findOne({username: username})
		.then(function(user) {

			if(!user) return res.notFound('user not found');

			require('machinepack-passwords').checkPassword({
				passwordAttempt: password,
				encryptedPassword: user.encryptedPassword
			})
			.exec({
				error: function(err) {
					res.negotiate(err); 
				},

				success: function() {
					req.session.me = user.id;
					res.ok('user validated');
				},
				
				incorrect: function() {
					res.notFound('bad password'); 
				}
			});

		})
		.catch(function(err) {
			console.log('catching error');
			res.negotiate(err); 
		});
	},

	signOut: function(req, res) {
		req.session.destroy(function(err){
			if(err) return res.negotiate(err); 
			return res.ok('user signed out');
		});
	},

	checkUserStatus: function(req, res) {
		if (!req.session.me) return res.ok('not signed in'); 
		return res.ok('signed in');
	}

	
};

