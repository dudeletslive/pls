var keystone = require('keystone')
	List = keystone.list('Mailing Lists'),
	Contact = keystone.list('Contact'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'mailingListIndex';

	

	User.model.find().where('isAdmin', true).exec(function(err, user) {

		if (err) {
			return next(err);
		}

		req.user = user;
		locals.user = user;

	});

	// Find Current User to Base lists loaded on
	req.session.uploadMyOwn = true;

	// Render the view
	view.render('CRM/noLists');
};
