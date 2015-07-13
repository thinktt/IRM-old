/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `AuthController.signIn()`
   */
  signIn: function (req, res) {
    //sails.log(req.json);
    //sails.log(req.password);
    sails.log(req.param('password'));
    req.session.authenticated = true; 
    return res.json({
      auhted: 'you authed yo!'
    });
    
  },


  /**
   * `AuthController.signOut()`
   */
  signOut: function (req, res) {
    req.session.authenticated = false; 
    return res.json({
      authed: 'Good night and good luck.'
    });
  }
};

