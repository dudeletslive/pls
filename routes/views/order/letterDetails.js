var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.tabID = 'letterDetails';
	locals.letterDetails = req.session.letterDetails;
	// Part One of formData
	req.session.letterDetails = locals.formData;
	console.log(locals.letterDetails);


	console.log('Letter Details: ' + req.session);
	
	// Render the view
	view.render('order/letterDetails');
};
