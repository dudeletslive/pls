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

	view.on('post', function() {

		console.log(locals.redirectURI + '?code=' + locals.code + '&state=' + locals.state);
		res.redirect(301, locals.redirectURI + '?code=' + locals.code + '&state=' + locals.state);

		User.model.findById(req.session.userId).exec(function(err, user) {

			if (err) {
				return next(err);
			}

			req.user = user;

		});
		
		var user = req.user,
			updater = user.getUpdateHandler(req);		

		updater.process(req.body, {
			flashErrors: true,
			fields: 'MPDX Code',
			errorMessage: 'We were unable to update your account:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
				req.flash('success', 'Your account has been updated.');
			}
			next();
		});

	})
	
	view.render('auth/mpdx');

}