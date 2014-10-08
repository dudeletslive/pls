var keystone = require('keystone'),
	async = require('async');

var services = {
	facebook: require('../../lib/auth/facebook'),
	linkedin: require('../../lib/auth/linkedin')
}

exports = module.exports = function(req, res, next) {

	if (!req.params.service) {
		console.log('[auth.service] - You must define the service you wish to authenticate with.');
		return res.redirect('/sign-in');
	}
	
	if (req.query.target) {
		console.log('[auth.service] - Set target as [' + req.query.target + '].');
		res.cookie('target', req.query.target);
	}
	
	services.facebook.authenticateUser(req, res, next);

};