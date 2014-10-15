var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;

	// Set locals
	locals.section = 'contact';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'save' }, function(next) {
		// Find the User posting it and update their information with the new information
		User.model.findById(req.session.userId).exec(function(err, user) {

			if (err) {
				return next(err);
			}

			req.user = user;

		});
		
		var user = req.user,
			updater = user.getUpdateHandler(req);		

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, password, address, returnAddress, cruStaffOrMinistryChartfield, emailInvoice, mailInvoice, emailReminders, ministryUpdateFrom, databaseMaintenance, mailingEnvelopeLogo',
			errorMessage: 'We were unable to update your account:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
				req.flash('success', 'Your account has been updated.');
			}
			next();
		});			
		// updater.process(req.body, {
		// 	flashErrors: true,
		// 	fields: 'name, email, phone, message',
		// 	errorMessage: 'There was a problem submitting your enquiry:'
		// }, function(err) {
		// 	if (err) {
		// 		locals.validationErrors = err.errors;
		// 	} else {
		// 		locals.enquirySubmitted = true;
		// 	}
		// 	next();
		// });
		
	});
	
	// Render the view
	view.render('session/myAccount');
};
