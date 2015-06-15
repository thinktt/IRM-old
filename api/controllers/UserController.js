/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	sayHowdy: function (req, res) {
		//return res.send('Howdy!');
		return res.forbidden(); 
	} 
	
};

