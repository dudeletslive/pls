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

	console.log(req.body);

	User.model.find({'services.MPDX.code': req.body.code}, function(err, user) {
		if (err) return false;
		
		var userData = {
			services: user.services || {}
		};
					
		_.extend(userData.services['MPDX'], {
			clientID: req.body.client_id,
			clientSecret: req.body.client_secret,
			accessToken: token
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
 "access_token" : "gglny4db3uuzmkf09lp4uja93ekwsh1a",
   "token_type" : "bearer"
		res.json({
			"access_token": token,
			"token_type": "bearer"
		});

	})

	view.render('auth/mpdx');
}