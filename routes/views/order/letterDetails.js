var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.tabID = 'letterDetails';
	// Part One of formData
	locals.letterDetails = req.session.letterDetails;
	req.session.letterDetails = locals.formData;

	console.log(locals.letterDetails);

	console.log('Letter Details: ' + req.session);

	if (!req.query.mailer) {
		res.redirect('/order');
		req.flash('error', 'Please select a type of mailer before proceeding.');
	} else {
		view.render('order/letterDetails');
	}

};
