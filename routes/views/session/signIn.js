var keystone = require('keystone'),
	session = require('keystone/lib/session');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals,
		redirect = req.query.redirect;

	if (req.method == "POST") {
		
		if (!req.body.email || !req.body.password) {
			locals.formError = 'form-error';
			return view.render('session/signIn');
		}
		
		var onSuccess = function(user) {
			if (req.body.target === 'order') {
				res.redirect(req.body.target);
			} else if (redirect) {
				res.redirect(redirect);
			} else {
				res.redirect('/mailing-lists/');
			}
		}
		
		var onFail = function() {
			locals.formError = 'form-error';
			view.render('session/signIn');
		}
		
		session.signin(req.body, req, res, onSuccess, onFail);

	}
	else {
		view.render('session/signIn');
	}
}