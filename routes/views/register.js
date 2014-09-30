var keystone = require('keystone'),
	User = keystone.list('User'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'register';
	locals.validationErrors = {};
	locals.userRegistered = false;

	// On POST requests, add the new user to the database
	locals.section = 'session';
	locals.form = req.body;
	console.log(req.cookies);
	view.on('post', { action: 'register' }, function(next) {

		async.series([
			
			function(cb) {
				
				if (!req.body.f_name || !req.body.l_name || !req.body.email || !req.body.password || !req.body.confirm_pass) {
					req.flash('error', 'Please enter a name, email and password.');
					return cb(true);
				}
				if (req.body.password != req.body.confirm_pass) {
					req.flash('error', 'Your passwords do not match.');
					return cb(true);
				}
				
				return cb();
				
			},
			
			function(cb) {
				
				keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {
					
					if (err || user) {
						req.flash('error', 'User already exists with that email address.');
						return cb(true);
					}
					
					return cb();
					
				});
				
			},
			
			function(cb) {

				var userData = {
					name: {
						first: req.body.f_name,
						last: req.body.l_name,
					},
					email: req.body.email,
					password: req.body.password,
					userID: req.body.userID,
					website: req.body.website
				};
				
				var User = keystone.list('User').model,
					newUser = new User(userData);

				newUser.save(function(err) {
					return cb(err);
				});
			
			}
			
		], function(err){
			
			if (err) return next();
			
			var onSuccess = function() {
				if (req.body.target === 'order') {
					res.redirect(req.body.target);
				} else if (req.body.target && !/join|signin/.test(req.body.target)) {
					res.redirect(req.body.target);
				} else {
					res.redirect('/');
				}
			}
			
			var onFail = function(e) {
				req.flash('error', 'There was a problem signing you in, please try again.');
				return next();
			}
			
			keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
			
		});
		
	});
	
	view.render('register');

	
};
