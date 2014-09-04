var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'about';
	
	// Query for Team Members
	view.query('teamMembers', keystone.list('Team Members').model.find().sort('sortOrder'));

	// Render the view
	view.render('about');
};
