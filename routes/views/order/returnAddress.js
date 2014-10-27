var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.tabID = 'returnAddress';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.letterDetails = req.session.letterDetails;
	locals.mailingList = req.session.mailingList;
	locals.returnAddress = req.session.returnAddress;

	console.log(req.session.mailingList)
	// Part Two of formData
	req.session.mailingList = locals.formData;

	locals.mailerType = req.query.mailer;

	// console.log(req.session.mailerType);
	
	// Render the view
	view.render('order/returnAddress');
};
