/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	// find: function (req, res){},
	// findOne: function (req, res){},
	// create: function (req, res){},
	// update: function (req, res){},
	//destroy: function (req, res){},
	
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
			
			success: function(result) {
	
				User.create({
					username: username,
					encryptedPassword: result,
					email: email
				}, function(err, newUser){

					//if error take care of it
					if(err) {
						if(err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0] &&
                 	err.invalidAttributes.username[0].rule === 'unique') {
							res.send('username already in use');
						} else if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] &&
                  err.invalidAttributes.email[0].rule === 'unique') {
							res.send('email already in use');
						}

						res.send(err);
					}
					//user is created
					res.send(newUser);
				});
			}

		});
			

		//res.send({username: username, encryptedPassword: password, email: email});

	 //User.create();
	 

	}



};

