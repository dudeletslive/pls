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

	// Render the view
	view.render('order/mailingList');
};
