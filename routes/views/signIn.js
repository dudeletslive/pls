var keystone 	= require('keystone'),
	session 	= require('keystone/lib/session');
exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;
	console.log(req.query.redirect);
	if (req.method == "POST") {
		
		if (!req.body.email || !req.body.password) {
			locals.formError = 'form-error';
			return view.render('signIn');
		}
		
		var onSuccess = function(user) {
			res.redirect('/');
		}
		
		var onFail = function() {
			locals.formError = 'form-error';
			view.render('signIn');
		}
		
		session.signin(req.body, req, res, onSuccess, onFail);

	}
	else {
		view.render('signIn');
	}
}