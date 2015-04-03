var keystone = require('keystone'),
	session = require('keystone/lib/session');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'signOut';
	
	session.signout(req, res, function() {
		res.redirect('/');
	});
	
	// Render the view
	// view.render('session/signOut');
};
