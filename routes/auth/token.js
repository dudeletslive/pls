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

	User.model.find({'services.MPDX.code': req.body.code}, function(err, user) {
		if (err) return false;
		console.log(user);
	})

	view.render('auth/mpdx');

}