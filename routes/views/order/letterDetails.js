var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.tabID = 'letterDetails';
	// Part One of formData
	locals.letterDetails = req.session.letterDetails;
	locals.mailerType = req.query.mailer;
	req.session.mailerType = locals.mailerType;
	req.session.letterDetails = locals.formData;

	locals.prettyList = locals.mailerType.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });

	console.log(req.session.mailerType);

	if (!req.session.mailerType) {
		res.redirect('/order');
		req.flash('error', 'Please select a type of mailer before proceeding.');
	} else {
		view.render('order/letterDetails');
	}

};
