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

	locals.code 		= keystone.utils.randomString([16,24]);
	locals.state		= req.query.state;
	locals.redirectURI  = req.query.redirect_uri;

	server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {

		var code = utils.uid(16),
			ac 	 = new AuthorizationCode(code, client.id, redirectURI, user.id, ares.scope);

		ac.save(function(err) {
			if (err) { return done(err); }
    		return done(null, code);
    		console.log(code);
		});

	}));
	
	view.render('auth/mpdx');

}