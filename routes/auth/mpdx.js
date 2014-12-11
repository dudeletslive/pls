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
	locals.existingUser = req.user;

	server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {

		var code = utils.uid(16),
			ac 	 = new AuthorizationCode(code, client.id, redirectURI, user.id, ares.scope);

		ac.save(function(err) {
			if (err) { return done(err); }
    		return done(null, code);
    		console.log(code);
		});

	}));

	console.log(locals.existingUser);

	view.on('post', function() {

		var userData = {
			services: locals.existingUser.services || {}
		};
		
		_.extend(userData.services['MPDX'], {
			isConfigured: true,
			code: locals.code
		});
					
		locals.existingUser.set(userData);
					
		locals.existingUser.save(function(err) {
			if (err) {
				console.log('[auth.confirm] - Error saving existing user.', err);
				console.log('------------------------------------------------------------');
			}
			console.log('[auth.confirm] - Saved existing user.');
			console.log('------------------------------------------------------------');
		});

		res.redirect(301, locals.redirectURI + '?code=' + locals.code + '&state=' + locals.state);

	})
	
	view.render('auth/mpdx');

}