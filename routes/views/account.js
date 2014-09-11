var keystone = require('keystone');

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
	} else if (url === '/register') {
		locals.register = true;
	} else if (url === '/reset') {
		locals.reset = true;
	}
	// Render the view
	view.render('account');
};
