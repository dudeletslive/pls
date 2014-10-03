var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.tabID = 'mailingList';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.letterDetails = req.session.letterDetails;
	// Part One of formData
	req.session.letterDetails = locals.formData;

	locals.redirect = req.url;

	console.log('Mailing List: ' + req.session);

	// Find Current User to Base lists loaded on
	User.model.findById(req.session.userId).exec(function(err, user) {

		if (err) {
			return next(err);
		}

		req.user = user;

	});

	view.query('lists', keystone.list('Mailing Lists').model.find().where('userID', req.user.userID).sort('sortOrder'));

	if (!req.query.mailer) {
		res.redirect('/order');
		req.flash('error', 'Please select a type of mailer before proceeding.');
	} else {
		locals.mailerType = req.query.mailer;
		view.render('order/mailingList');
	}
	// Render the view
};
