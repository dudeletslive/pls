var keystone = require('keystone'),
	session = require('keystone/lib/session');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals,
		url = req.url;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'account';
	if (url === '/forgot-password') {
		locals.forgot = true;
	} else if (url === '/sign-in') {
		locals.signin = true;
		if (req.method === 'POST') {
			// Check both email and password have been submitted, if not request that info
			if (!req.body.email || !req.body.password) {
				req.flash('error', 'Please enter your email address and password.');
				view.render('sign-in');
			}
			// If sign in is successful
			var onSuccess = function(user) {
				view.render('/account');
			};
			// If the sign in fails, tell em' why.
			var onFail = function() {
				req.flash('error', 'Sorry, that email and password combo are not valid.');
				view.render('sign-in');
			};
			session.signin(req.body, req, res, onSuccess, onFail);
		}
	} else if (url === '/register') {
		locals.register = true;
	} else if (url === '/reset') {
		locals.reset = true;
	}
	// Render the view
	view.render('account');
};
