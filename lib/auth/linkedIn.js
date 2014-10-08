var async = require('async'),
	_ = require('underscore');

var passport = require('passport'),
	passportFacebookStrategy = require('passport-linkedIn').Strategy;



var keystone = require('keystone'),
	User = keystone.list('User');

var credentials = {
	consumerKey: process.env.LINKEDIN_API_KEY,
	consumerSecret: process.env.LINKEDIN_SECRET_KEY,
	callbackURL: 'http://localhost:3000/auth/linkedin?cb'
};

exports.authenticateUser = function(req, res, next)
{
	var self = this;
	
	var redirect = '/confirm';
	if (req.cookies.target && req.cookies.target == 'app') redirect = '/auth/app';
	
	// Begin process
	console.log('============================================================');
	console.log('[services.linkedIn] - Triggered authentication process...');
	console.log('------------------------------------------------------------');
	
	// Initalise Facebook credentials
	var facebookStrategy = new passportFacebookStrategy(credentials, function(token, tokenSecret, profile, done) {
			profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline'];
		}
	);
	
	// Pass through authentication to passport
	passport.use(facebookStrategy);
	
	// Save user data once returning from Facebook
	if (_.has(req.query, 'cb')) {
		
		console.log('[services.linkedin] - Callback workflow detected, attempting to process data...');
		console.log('------------------------------------------------------------');
		
		console.log(id)

		passport.authenticate('linkedin', { session: false }, function(err, data, info) {
		
			if (err || !data) {
				console.log("[services.linkedin] - Error retrieving Facebook account data - " + JSON.stringify(err));
				return res.redirect('/sign-in');
			}
			
			console.log('[services.linkedin] - Successfully retrieved Facebook account data, processing...');
			console.log('------------------------------------------------------------');
			
			var name = data.profile && data.profile.displayName ? data.profile.displayName.split(' ') : [];
			
			var auth = {
				type: 'linkedin',
				
				name: {
					first: name.length ? name[0] : '',
					last: name.length > 1 ? name[1] : ''
				},
				
				email: data.profile.emails.length ? _.first(data.profile.emails).value : null,
				
				website: data.profile._json.blog,
				
				profileId: data.profile.id,
				
				username: data.profile.username,
				avatar: 'https://graph.facebook.com/' + data.profile.id + '/picture?width=600&height=600',
				
				accessToken: data.accessToken,
				refreshToken: data.refreshToken
			}
			
			req.session.auth = auth;
			
			return res.redirect(redirect);
			
		})(req, res, next);
	
	// Perform inital authentication request to Facebook
	} else {
		
		console.log('[services.linkedin] - Authentication workflow detected, attempting to request access...');
		console.log('------------------------------------------------------------');
		
		passport.authenticate('linkedin')(req, res, next);
	
	}
	
};