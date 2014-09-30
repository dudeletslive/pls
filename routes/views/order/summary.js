var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.tabID = 'summary';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.letterDetails = req.session.letterDetails;
	locals.mailingList = req.session.mailingList;
	locals.returnAddress = req.session.returnAddress;
	// Part Three of formData
	req.session.returnAddress = locals.formData;
	
	// Render the view
	view.render('order/summary');
};
