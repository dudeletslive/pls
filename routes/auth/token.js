var keystone 	= require('keystone'),
	async 		= require('async'),
	request 	= require('request'),
	_ 			= require('underscore'),
	oauth2orize = require('oauth2orize'),
	User 		= keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view   = new keystone.View(req, res),
		locals = res.locals,
		server = oauth2orize.createServer(),
		token  = keystone.utils.randomString(48);

	User.model.find({'services.MPDX.code': req.body.code}, function(err, user) {

		if (err) return false;

		var user = user[0];
		
		var userData = {
			services: user.services || {}
		};
					
		_.extend(userData.services['MPDX'], {
			clientID: req.body.client_id,
			clientSecret: req.body.client_secret,
			accessToken: 'Bearer ' + token
		});
					
		user.set(userData);
					
		user.save(function(err) {
			if (err) {
				console.log('[auth.confirm] - Error saving existing user.', err);
				console.log('------------------------------------------------------------');
			}
			console.log('[auth.confirm] - Saved existing user.');
			console.log('------------------------------------------------------------');
		});

	})

	res.json({
		"access_token": token,
		"token_type": "bearer"
	});

}