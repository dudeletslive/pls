var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	req.flash('info', 'MyLetterService is currently undergoing live maintenance as we make the transition to our new site and database. You can still access your database at <a href="http://www.mydatabaseservice.org">MyDatabaseService</a> in the mean time. During this live maintenance period you may experience brief disruptions of service. We apologize for any inconvience this may cause.');
	
	// Render the view
	view.render('index');
};
