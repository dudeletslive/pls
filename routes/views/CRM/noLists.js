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

	if (req.method === 'POST') {

		User.model.findById(req.session.userId).exec(function(err, user) {

			if (err) {
				return next(err);
			}

			req.user = user;

		});

		console.log('Posted! Updating ' + req.user.firstName + ' now.');
		
		var user = req.user,
				updater = user.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'noCRM',
			errorMessage: 'We were unable to update your account:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
				req.session.uploadMyOwn = true;
				res.redirect('/mailing-lists');
			}
		});

	} else {

		// Find Current User to Base lists loaded on
		req.session.uploadMyOwn = true;

		// Render the view
		view.render('CRM/noLists');

	}

};
