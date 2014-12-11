var keystone 	= require('keystone'),
	async 		= require('async'),
	request 	= require('request'),
	_ 			= require('underscore'),
	oauth2orize = require('oauth2orize'),
	User 		= keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view   = new keystone.View(req, res),
		locals = res.locals,
		server = oauth2orize.createServer();

	console.log(req.query.grant_type);
	console.log('--------------')
	console.log('Request: ', req);
	console.log('--------------')

	view.render('auth/mpdx');

}